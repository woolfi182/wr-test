import { Module } from "@nestjs/common";
import { ConfigsModule } from "./configs/configs.module";
import { TitleModule } from "./modules/title/title.module";

@Module({
  imports: [ConfigsModule, TitleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
