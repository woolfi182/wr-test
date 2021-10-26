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
  InternalServerErrorOutput,
  DataForTitleOutput,
  EResponseStatus,
} from "./output";
import { generateUniqueHash } from "../../helpers/hash";
import { TasksService } from "../tasks/tasks.service";

@ApiTags("Generate Title")
@Controller({
  path: "title",
  version: VERSION_NEUTRAL,
})
export class TitleController {
  constructor(
    private readonly titleService: TitleService,
    private tasksService: TasksService,
  ) {}

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

    // TODO: fetch from cache

    // Check whether we have processed the chunk before
    // If so, there is nothing to do here
    const processedData = await this.titleService.getTitleData(uniqueName);
    if (processedData) {
      // TODO: save to cache for future

      return {
        status: processedData.status as EResponseStatus,
        title: processedData.title,
      };
    }

    // Chunk has newer been handeled before
    await this.titleService.saveDataForTitle(uniqueName, body.data);

    // TODO: Save to cache for future
    return {
      status: EResponseStatus.QUEUED,
    };
  }
}
