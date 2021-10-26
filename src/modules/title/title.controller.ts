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
import { generateUniqueHash } from "../../helpers/hash";

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
    // To make search faster, let's generate hashes
    const uniqueName = await generateUniqueHash(body.data);

    await this.titleService.generateTitle(body.data);

    // Check whether we have processed the chunk before
    // If so, there is nothing to do here
    const processedData = await this.titleService.getTitleData(uniqueName);
    if (processedData) {
      return {
        status: processedData.status as EProcessingStatus,
        title: processedData.title,
      };
    }

    // Chunk has newer been handeled before
    await this.titleService.saveDataForTitle(uniqueName, body.data);
    return {
      status: EProcessingStatus.QUEUED,
    };
  }
}
