import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello World! with v1"', () => {
      expect(appController.getHelloV1()).toBe("Hello World! (version: v1)");
    });
    it('should return "Hello World! with v2"', () => {
      expect(appController.getHelloV2()).toBe("Hello World! (version: v2)");
    });
  });
});
