import { Module, forwardRef } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { TasksService } from "./tasks.service";
import { TitleModule } from "../title/title.module";
import { OpenAiService } from "../openai/openai.service";
import { ConfigsModule } from "src/configs/configs.module";

@Module({
  imports: [
    forwardRef(() => TitleModule),
    ScheduleModule.forRoot(),
    ConfigsModule,
  ],
  providers: [TasksService, OpenAiService],
  exports: [TasksService],
})
export class TasksModule {}
