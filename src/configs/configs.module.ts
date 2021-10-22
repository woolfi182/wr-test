import { Module } from "@nestjs/common";
import { AppConfigModule } from "./app/app.module";
import { MongodbConfigModule } from "./mongodb/mongodb.module";

@Module({
  imports: [AppConfigModule, MongodbConfigModule],
  exports: [AppConfigModule, MongodbConfigModule],
})
export class ConfigsModule {}
