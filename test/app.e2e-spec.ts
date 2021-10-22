import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, VersioningType } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.enableVersioning({
      type: VersioningType.URI,
    });
    await app.init();
  });

  it("/title (POST)", () => {
    return request(app.getHttpServer())
      .post("/title")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .send({ data: "any chunk data" })
      .expect(201)
      .expect({
        title: "Here is a title",
        status: "completed",
      });
  });
});
