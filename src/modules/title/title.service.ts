import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Title, TitleDocument } from "./models";
import { EProcessingStatus } from "./output";

@Injectable()
export class TitleService {
  constructor(
    @InjectModel(Title.name) private titleModel: Model<TitleDocument>,
  ) {}

  /**
   * Get Stored data for title processing
   *
   * @param hash Hash generated from chunk
   * @returns Stored objerct in the MongoDB
   */
  async getTitleData(hash: string): Promise<Title> {
    const params = { title: 1, status: 1 };
    return this.titleModel.findOne({ hash }, params);
  }

  /**
   * Save data to following processing via AI
   *
   * @param hash Hash generated from chunk
   * @param text Chunk of data to process
   * @returns void
   */
  async saveDataForTitle(hash: string, text: string): Promise<void> {
    const data = {
      hash,
      text,
      status: EProcessingStatus.QUEUED,
    };
    const createdTitleData = new this.titleModel(data);
    await createdTitleData.save();
    return null;
  }
}
