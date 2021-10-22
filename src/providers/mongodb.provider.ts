import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ConfigsModule } from "../configs/configs.module";
import { MongodbConfigService } from "../configs/mongodb/mongodb.service";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigsModule],
      useFactory: async (configService: MongodbConfigService) => ({
        uri: configService.url,
        retryAttempts: configService.retryAttempts,
      }),
      inject: [MongodbConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class MongodbProviderModule {}
