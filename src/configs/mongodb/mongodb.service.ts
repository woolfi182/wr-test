import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service dealing with Mongodb config based operations.
 *
 * @class
 */
@Injectable()
export class MongodbConfigService {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.get<string>("mongodb.url");
  }
  get retryAttempts(): number {
    return this.configService.get<number>("mongodb.retryAttempts");
  }
}
