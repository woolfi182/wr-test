import * as redisStore from "cache-manager-redis-store";
import { CacheModule, Global, Module } from "@nestjs/common";

import { ConfigsModule } from "../configs/configs.module";
import { CacheConfigService } from "../configs/cache/cache.service";

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigsModule],
      useFactory: (cacheService: CacheConfigService) => {
        return {
          store: redisStore,
          host: cacheService.host,
          port: cacheService.port,
          ttl: cacheService.ttl,
        };
      },
      inject: [CacheConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class CacheProviderModule {}
