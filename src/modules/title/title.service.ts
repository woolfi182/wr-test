import { Injectable } from "@nestjs/common";

@Injectable()
export class TitleService {
  /**
   * Get Stored data for title processing
   *
   * @param _chunk Chunk of data to process
   * @returns Stored objerct in the MongoDB
   */
  async getTitleData(
    _chunk: string,
  ): Promise<{ title?: string; status: string }> {
    return {
      title: undefined,
      status: "queued",
    };
  }

  /**
   * Save data to following processing via AI
   * @param _chunk Chunk of data to process
   * @returns void
   */
  async saveDataForTitle(_chunk: string): Promise<void> {
    return null;
  }
}
