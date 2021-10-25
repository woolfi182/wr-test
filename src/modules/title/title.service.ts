import { Injectable } from "@nestjs/common";

@Injectable()
export class TitleService {
  /**
   * Get Stored data for title processing
   *
   * @param _hash Hash generated from chunk
   * @returns Stored objerct in the MongoDB
   */
  async getTitleData(
    _hash: string,
  ): Promise<{ title?: string; status: string }> {
    return {
      status: "queued",
    };
  }

  /**
   * Save data to following processing via AI
   *
   * @param _hash Hash generated from chunk
   * @param _chunk Chunk of data to process
   * @returns void
   */
  async saveDataForTitle(_hash: string, _chunk: string): Promise<void> {
    return null;
  }
}
