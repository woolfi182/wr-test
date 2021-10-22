import { Body, Controller, Post, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { TitleService } from "./title.service";

interface IProcessTextInput {
  data: string;
}

interface IProcessTextOutput {
  title: string;
  status: "completed" | "error" | "queued";
}

@Controller({
  path: "title",
  version: VERSION_NEUTRAL,
})
export class TitleController {
  constructor(private readonly titleSrvs: TitleService) {}

  @Post()
  @ApiOkResponse({
    status: 201,
    description: "Success response",
  })
  async processText(
    @Body() body: IProcessTextInput,
  ): Promise<IProcessTextOutput> {
    const title = await this.titleSrvs.getTitle(body.data);
    return {
      title,
      status: "completed",
    };
  }
}
