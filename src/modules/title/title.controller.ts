import {
  Body,
  Controller,
  HttpCode,
  Post,
  Inject,
  ValidationPipe,
  CACHE_MANAGER,
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
import { Cache } from "cache-manager";

import { TitleService } from "./title.service";

import { DataForTitleInput } from "./input";
import {
  BadRequestOutput,
  InternalServerErrorOutput,
  DataForTitleOutput,
  EResponseStatus,
} from "./output";
import { generateUniqueHash } from "../../helpers/hash";

@ApiTags("Generate Title")
@Controller({
  path: "title",
  version: VERSION_NEUTRAL,
})
export class TitleController {
  constructor(
    private readonly titleService: TitleService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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

    // Fetch from cache
    const cachedRes = await this.cacheManager.get<DataForTitleOutput>(
      uniqueName,
    );
    if (cachedRes) {
      return cachedRes;
    }

    // Check whether we have processed the chunk before
    // If so, there is nothing to do here
    const processedData = await this.titleService.getTitleData(uniqueName);
    if (processedData) {
      const responseData = {
        status: this.titleService.getResponseStatus(processedData.status),
        title: processedData.title,
      };

      // Save to cache for future
      await this.cacheManager.set(uniqueName, responseData);

      return responseData;
    }

    // Chunk has newer been handeled before
    await this.titleService.saveDataForTitle(uniqueName, body.data);

    // Save to cache for future
    const responseData = {
      status: EResponseStatus.QUEUED,
    };

    // Save to cache for future
    await this.cacheManager.set(uniqueName, responseData);

    return responseData;
  }
}
