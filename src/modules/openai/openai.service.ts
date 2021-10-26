import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { title } from "process";

import { AppConfigService } from "../../configs/app/app.service";
import { TitleDocument } from "../title/models";

@Injectable()
export class OpenAiService {
  openai!: AxiosInstance;

  constructor(private appConfigService: AppConfigService) {
    // If needed, could be parameterized
    const url = "https://api.openai.com";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.appConfigService.openaiApiKey}`,
    };
    this.openai = axios.create({
      baseURL: url,
      headers,
      timeout: 10000, // Timeout 10 sec otherwise - error and retrigger
      withCredentials: true,
    });
  }

  async generateTitle(text: string): Promise<string> {
    const response = await this.fetchTitleFromOpenAi(text);
    const cleanedChunks = await this.cleanUpChunks(response);
    const title = await this.parseTitleFromChunks(cleanedChunks);
    return title;
  }

  async fetchTitleFromOpenAi(text: string): Promise<string> {
    const { data } = await this.openai.post("/v1/engines/davinci/completions", {
      prompt: `Q: Here is a dialogue\n\n"""\n${text}\n"""\n\nWhat short title is a good fit?\nA:`,
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

    const probableTitle = words.join(" ");

    const answRegEx = /^I?\s*think\s*the\s*short\s*title\s*is\s*\\"\s*/;

    if (answRegEx.test(probableTitle)) {
      return probableTitle.replace(answRegEx, "").replace(/"$/, "");
    }

    return probableTitle;
  }

  async getTitlesForElements(elements: TitleDocument[]): Promise<string[]> {
    return Promise.all(
      elements.map((el) => {
        const text = el.text;
        return this.generateTitle(text);
      }),
    );
  }
}
