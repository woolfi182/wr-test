import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, VersioningType } from "@nestjs/common";
import * as request from "supertest";

import { TitleModule } from "../src/modules/title/title.module";

describe("TitleController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TitleModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.enableVersioning({
      type: VersioningType.URI,
    });

    await app.init();
  });

  describe("/title POST", () => {
    it("should return 400 if data is empty string", () => {
      const data = { data: "" };
      const responseBodyMessage = "data should not be empty";

      return request(app.getHttpServer())
        .post("/title")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .send(data)
        .expect(400)
        .expect((response) => {
          if (!response.body.message.includes(responseBodyMessage)) {
            throw new Error("incorrect message");
          }
        });
    });

    it("should return 400 if data is not a string", () => {
      const data = { data: 456 };
      const responseBodyMessage = "data must be a string";

      return request(app.getHttpServer())
        .post("/title")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .send(data)
        .expect(400)
        .expect((response) => {
          if (!response.body.message.includes(responseBodyMessage)) {
            throw new Error("incorrect message");
          }
        });
    });

    it("should return success response", () => {
      const data = { data: "any chunk data" };

      return request(app.getHttpServer())
        .post("/title")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .send(data)
        .expect(201)
        .expect({
          title: "Here is a title",
          status: "completed",
        });
    });
  });
});
