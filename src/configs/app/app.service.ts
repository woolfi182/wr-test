import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>("app.name");
  }
  get env(): string {
    return this.configService.get<string>("app.env");
  }
  get port(): number {
    return this.configService.get<number>("app.port");
  }

  get openaiApiKey(): string {
    return this.configService.get<string>("app.openaiApiKey");
  }

  /**
   * Chech if the ENV is prod-like
   * @returns true/false
   */
  isProd(): boolean {
    // Could be prod, or provision or other prod-like env
    return !["development", "test", "local"].includes(this.env);
  }
}
