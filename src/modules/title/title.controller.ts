import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { TitleService } from "./title.service";

import { DataForTitleInput } from "./input";
import {
  BadRequestOutput,
  EProcessingStatus,
  InternalServerErrorOutput,
  DataForTitleOutput,
} from "./output";

@ApiTags("Generate Title")
@Controller({
  path: "title",
  version: VERSION_NEUTRAL,
})
export class TitleController {
  constructor(private readonly titleService: TitleService) {}

  /**
   * Process text for generating title handler
   */
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: "Generate title using OpenAI" })
  @ApiOkResponse({
    description: "Successful response",
    type: DataForTitleOutput,
  })
  @ApiBadRequestResponse({
    description: "Provided data is not valid",
    type: BadRequestOutput,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
    type: InternalServerErrorOutput,
  })
  @ApiBody({
    type: DataForTitleInput,
    required: true,
  })
  async handleDataForTitle(
    @Body(new ValidationPipe()) body: DataForTitleInput,
  ): Promise<DataForTitleOutput> {
    // Check whether we have processed the chunk before
    // If so, there is nothing to do here
    // TODO: improve speed via hashes
    const processedData = await this.titleService.getTitleData(body.data);
    if (processedData) {
      return {
        status: processedData.status as EProcessingStatus,
        title: processedData.title,
      };
    }

    // Chunk has newer been handeled before
    await this.titleService.saveDataForTitle(body.data);
    return {
      status: EProcessingStatus.QUEUED,
    };
  }
}
