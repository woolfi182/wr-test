import { Test, TestingModule } from "@nestjs/testing";
import { TitleController } from "./title.controller";
import { TitleService } from "./title.service";

describe("TitleController", () => {
  let titleController: TitleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TitleController],
      providers: [TitleService],
    }).compile();

    titleController = app.get<TitleController>(TitleController);
  });

  describe("/title", () => {
    it('should return "Here is a title"', async () => {
      const body = {
        data: "any data",
      };
      const res = await titleController.processText(body);
      expect(res).toStrictEqual({
        title: "Here is a title",
        status: "completed",
      });
    });
  });
});
