import { Module } from "@nestjs/common";
import * as Joi from "@hapi/joi";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./configuration";
import { CacheConfigService } from "./cache.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().default("localhost"),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_CACHE_TTL: Joi.number().default(10), // 10 seconds
      }),
    }),
  ],
  providers: [ConfigService, CacheConfigService],
  exports: [CacheConfigService],
})
export class CacheConfigModule {}
