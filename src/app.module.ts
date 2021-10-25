import { Module } from "@nestjs/common";
import { ConfigsModule } from "./configs/configs.module";
import { TitleModule } from "./modules/title/title.module";
// import { MongodbProviderModule } from "./providers";

@Module({
  imports: [ConfigsModule, TitleModule], //MongodbProviderModule],
})
export class AppModule {}
