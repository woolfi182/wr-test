import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Title, TitleDocument } from "./models";
import { EProcessingStatus, EResponseStatus } from "./output";

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

  async getNElementsToProcess(elsAmount: number): Promise<TitleDocument[]> {
    // TODO: should we process Errors?
    const findParams = {
      status: EProcessingStatus.QUEUED,
    };
    const filterParams = {
      hash: 1,
      text: 1,
      status: 1,
    };
    const opts = {
      sort: { createdAt: 1 },
      limit: elsAmount,
    };
    return this.titleModel.find(findParams, filterParams, opts);
  }

  async updateElementsStatus(
    status: EProcessingStatus,
    elements: TitleDocument[],
  ): Promise<void> {
    await Promise.all(
      elements.map((el) => {
        el.status = status;
        return el.save();
      }),
    );
  }

  getResponseStatus(status: EProcessingStatus): EResponseStatus {
    return status === EProcessingStatus.PROCESSING
      ? EResponseStatus.QUEUED
      : (status as any as EResponseStatus);
  }
}
