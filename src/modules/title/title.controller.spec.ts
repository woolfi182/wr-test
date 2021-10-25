import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

import { MongoConnection } from "../../../test/helpers/mongo";
import { Title } from "./models";

import { TitleController } from "./title.controller";
import { TitleService } from "./title.service";

class TitleModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(null);
  static findOne = jest.fn().mockResolvedValue({
    status: "queued",
  });
}

describe("TitleController", () => {
  let titleController: TitleController;
  const mongo = new MongoConnection();

  beforeAll(async () => {
    await mongo.connect();
  });

  beforeEach(async () => {
    await mongo.clearDatabase();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TitleController],
      providers: [
        TitleService,
        {
          provide: getModelToken(Title.name),
          useValue: TitleModel,
        },
      ],
    }).compile();

    titleController = app.get<TitleController>(TitleController);
  });
  afterAll(async () => {
    await mongo.disconnect();
  });

  describe("/title", () => {
    it('should return "Here is a title"', async () => {
      const body = {
        data: "any data",
      };
      const res = await titleController.handleDataForTitle(body);
      expect(res).toStrictEqual({
        status: "queued",
        title: undefined,
      });
    });
  });
});
