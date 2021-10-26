import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigsModule } from "../../configs/configs.module";

import { Title, TitleSchema } from "./models";
import { TitleController } from "./title.controller";
import { TitleService } from "./title.service";

@Module({
  imports: [
    ConfigsModule,
    MongooseModule.forFeature([
      {
        name: Title.name,
        schema: TitleSchema,
      },
    ]),
  ],
  controllers: [TitleController],
  providers: [TitleService],
})
export class TitleModule {}
