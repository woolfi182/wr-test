import { Body, Controller, Post, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { ProcessTextInput } from "./input";
import { EProcessTextStatus, ProcessTextOutput } from "./output";
import { TitleService } from "./title.service";

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
    @Body() body: ProcessTextInput,
  ): Promise<ProcessTextOutput> {
    const title = await this.titleSrvs.getTitle(body.data);
    return {
      title,
      status: EProcessTextStatus.COMPLETED,
    };
  }
}
