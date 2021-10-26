import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import axios, { AxiosInstance } from "axios";

import { Title, TitleDocument } from "./models";
import { EProcessingStatus } from "./output";
import { AppConfigService } from "../../configs/app/app.service";

@Injectable()
export class TitleService {
  openai!: AxiosInstance;

  constructor(
    @InjectModel(Title.name) private titleModel: Model<TitleDocument>,
    private appConfigService: AppConfigService,
  ) {
    // If needed, could be parameterized
    const url = "https://api.openai.com";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.appConfigService.openaiApiKey}`,
    };
    this.openai = axios.create({
      baseURL: url,
      headers,
      withCredentials: true,
    });
  }

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

  async generateTitle(text: string): Promise<string> {
    const response = await this.fetchTitleFromOpenAi(text);
    const cleanedChunks = await this.cleanUpChunks(response);
    const title = await this.parseTitleFromChunks(cleanedChunks);
    return title;
  }

  async fetchTitleFromOpenAi(text: string): Promise<string> {
    const { data } = await this.openai.post("/v1/engines/davinci/completions", {
      prompt: `Q: Here is the text\n\n"""\n${text}\n"""\n\nWhat title is a good fit?\nA:`,
      max_tokens: 100,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      best_of: 1,
      echo: true,
      logprobs: 0,
      stop: ["\n"],
      stream: true,
    });
    if (!data) {
      throw new Error("Response from OpenAi is not valid");
    }
    return data as string;
  }

  async cleanUpChunks(data: string): Promise<string[]> {
    const chunks = data.split("\n\n").map((el) => el.replace(/^data:\s/, ""));
    // Get rid of last elements as they are \\, '', [DONE] and '\n'  (redundant)
    chunks.splice(-4, 4);
    // Get rid of the first element as it is a question we sent to OpenAI
    chunks.splice(0, 1);

    return chunks;
  }

  async parseTitleFromChunks(chunks: string[]): Promise<string> {
    // Parse elements and fetch choices[0].text that represents answer
    // As JSON parsing is too slow, let's fetch words using regEx
    const words = chunks.map((chunk) => {
      const actualTextPosPref = 11; // 11 is the length of -> [{"text": "  <- where the answer starts
      const textStartPos = chunk.search(/\[\{"text":/) + actualTextPosPref;
      const textEndPos = chunk.search(/, "index":/) - 1; // position of a single "

      return chunk.slice(textStartPos, textEndPos);
    });
    return words.join();
  }
}
