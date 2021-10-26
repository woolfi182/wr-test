import { Module } from "@nestjs/common";
import * as Joi from "@hapi/joi";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./configuration";
import { AppConfigService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_NAME: Joi.string().default("AIApplication"),
        APP_ENV: Joi.string()
          .valid("development", "test", "production", "provision")
          .default("development"),
        APP_PORT: Joi.number().default(3000),
        OPENAI_RATE: Joi.number().default(5),
        OPENAI_API_KEY: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
