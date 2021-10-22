import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { AppConfigService } from "./configs/app/app.service";
import * as pkgJson from "../package.json";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger part
  const swaggerConfig = new DocumentBuilder()
    .setTitle(pkgJson.title)
    .setDescription(pkgJson.description)
    .setVersion(pkgJson.version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  // Server start
  await app.listen(appConfig.port, async () => {
    console.log(`[ SERVER ] Ready on localhost:${appConfig.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
