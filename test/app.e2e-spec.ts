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

  it("/v1/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/v1/")
      .expect(200)
      .expect("Hello World! (version: v1)");
  });

  it("/v2/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/v2/")
      .expect(200)
      .expect("Hello World! (version: v2)");
  });
});
