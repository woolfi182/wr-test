import { Module } from "@nestjs/common";
import { AppConfigModule } from "./app/app.module";
import { CacheConfigModule } from "./cache/cache.module";
import { MongodbConfigModule } from "./mongodb/mongodb.module";

@Module({
  imports: [AppConfigModule, MongodbConfigModule, CacheConfigModule],
  exports: [AppConfigModule, MongodbConfigModule, CacheConfigModule],
})
export class ConfigsModule {}
