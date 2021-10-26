import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { TasksModule } from "../tasks/tasks.module";

import { Title, TitleSchema } from "./models";
import { TitleController } from "./title.controller";
import { TitleService } from "./title.service";

@Module({
  imports: [
    forwardRef(() => TasksModule),
    MongooseModule.forFeature([{ name: Title.name, schema: TitleSchema }]),
  ],
  controllers: [TitleController],
  providers: [TitleService],
  exports: [TitleService],
})
export class TitleModule {}
