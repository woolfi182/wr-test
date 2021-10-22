import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { ProcessTextInput } from "./input";
import { EProcessTextStatus, ProcessTextOutput } from "./output";
import { TitleService } from "./title.service";

@ApiTags("Generate Title")
@Controller({
  path: "title",
  version: VERSION_NEUTRAL,
})
export class TitleController {
  constructor(private readonly titleService: TitleService) {}

  @Post()
  @ApiOperation({ summary: "Generate title using OpenAI" })
  @ApiCreatedResponse({
    description: "Successful response",
  })
  @ApiBadRequestResponse({
    description: "Provided data is not valid",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  @ApiBody({
    type: ProcessTextInput,
    required: true,
  })
  async processText(
    @Body(new ValidationPipe()) body: ProcessTextInput,
  ): Promise<ProcessTextOutput> {
    const title = await this.titleService.getTitle(body.data);
    return {
      title,
      status: EProcessTextStatus.COMPLETED,
    };
  }
}
