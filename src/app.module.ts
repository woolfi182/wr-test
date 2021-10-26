import { Module } from "@nestjs/common";
import { ConfigsModule } from "./configs/configs.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { TitleModule } from "./modules/title/title.module";
import { MongodbProviderModule } from "./providers";

@Module({
  imports: [ConfigsModule, MongodbProviderModule, TitleModule, TasksModule],
})
export class AppModule {}
