import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { AppConfigService } from "./configs/app/app.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);

  await app.listen(appConfig.port, async () => {
    console.log(`[ SERVER ] Ready on localhost:${appConfig.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
