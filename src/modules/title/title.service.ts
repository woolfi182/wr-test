import { Injectable } from "@nestjs/common";

@Injectable()
export class TitleService {
  async getTitle(_chunk: string): Promise<string> {
    return "Here is a title";
  }
}
