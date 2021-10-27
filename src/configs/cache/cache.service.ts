import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service dealing with Cache config based operations.
 *
 * @class
 */
@Injectable()
export class CacheConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>("cache.host");
  }

  get port(): number {
    return this.configService.get<number>("cache.port");
  }

  get ttl(): number {
    return this.configService.get<number>("cache.ttl");
  }
}
