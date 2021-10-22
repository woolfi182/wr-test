import { Module } from "@nestjs/common";
import * as Joi from "@hapi/joi";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./configuration";
import { MongodbConfigService } from "./mongodb.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MONGODB_URL: Joi.string().required(),
        MONGODB_RETRY_ATTEMPTS: Joi.number().default(3),
      }),
    }),
  ],
  providers: [ConfigService, MongodbConfigService],
  exports: [MongodbConfigService],
})
export class MongodbConfigModule {}
