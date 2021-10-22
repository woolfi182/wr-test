import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(v: number): string {
    return `Hello World! (version: v${v})`;
  }
}
