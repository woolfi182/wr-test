import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

import { MongoConnection } from "../../../test/helpers/mongo";
import { Title } from "./models";

import { TitleController } from "./title.controller";
import { TitleService } from "./title.service";
import { ConfigsModule } from "../../configs/configs.module";

class TitleModel {
  constructor(private data) {}
  save = jest.fn();
  static findOne = jest.fn();
}

const cacheManager = {
  get: jest.fn(),
  set: jest.fn(),
};

describe("TitleController", () => {
  let titleController: TitleController;
  let titleModel: TitleModel;
  const mongo = new MongoConnection();

  beforeAll(async () => {
    await mongo.connect();
  });

  beforeEach(async () => {
    await mongo.clearDatabase();
    jest.resetAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigsModule],
      controllers: [TitleController],
      providers: [
        TitleService,
        {
          provide: getModelToken(Title.name),
          useValue: TitleModel,
        },
        {
          provide: "CACHE_MANAGER",
          useValue: cacheManager,
        },
      ],
    }).compile();

    titleController = app.get<TitleController>(TitleController);
    titleModel = app.get<TitleModel>(getModelToken(Title.name));
  });
  afterAll(async () => {
    await mongo.disconnect();
  });

  describe("/title", () => {
    it("should return response from db and save to cache", async () => {
      const body = {
        data: "any data",
      };

      TitleModel.findOne = jest.fn().mockResolvedValue({
        status: "queued",
      });
      const res = await titleController.handleDataForTitle(body);
      expect(res).toStrictEqual({
        status: "queued",
        title: undefined,
      });

      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringMatching(/[a-zA-Z0-9]*/),
        {
          status: "queued",
          title: undefined,
        },
      );
    });

    it("should return data from cache", async () => {
      const body = {
        data: "any data",
      };
      const cache = {
        status: "completed",
        title: "super",
      };

      cacheManager.get = jest.fn(async (_key) => cache);

      const res = await titleController.handleDataForTitle(body);
      expect(res).toStrictEqual(cache);
    });

    it("should save to db and cache then return", async () => {
      const body = {
        data: "any data",
      };

      titleModel.save = jest.fn();
      cacheManager.set = jest.fn(async <T>(key: string, value: T) => value);

      const res = await titleController.handleDataForTitle(body);
      expect(res).toStrictEqual({
        status: "queued",
      });
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringMatching(/[a-zA-Z0-9]*/),
        {
          status: "queued",
          title: undefined,
        },
      );
    });
  });
});
