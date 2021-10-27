import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  CACHE_MANAGER,
} from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { Cache } from "cache-manager";

import { AppConfigService } from "../../configs/app/app.service";
import { OpenAiService } from "../openai/openai.service";
import { EProcessingStatus } from "../title/output";
import { TitleService } from "../title/title.service";

enum ETaskStatus {
  SUCCESS,
  SKIPPED,
}
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  interval = 5; // 5 sec

  constructor(
    private openaiService: OpenAiService,
    @Inject(forwardRef(() => TitleService))
    private titleService: TitleService,
    private appConfigService: AppConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Trigger of the processing task
   */
  @Interval(1000) // Every second
  triggerProcessingTask(): void {
    // As we can't wait the results, let's do that in background
    this.runProcessingSequence()
      .then((status) => {
        switch (status) {
          case ETaskStatus.SUCCESS:
            this.logger.log("Task was successfully finished");
            return;
          case ETaskStatus.SKIPPED:
            // Just skip it
            return;
          default:
            return;
        }
      })
      .catch((error) => this.logger.error("Task had some problems", error));
  }

  /**
   * The steps of the task are following:
   *   - fetch 5 elements or less
   *   - in paralel:
   *   - - change their status to processing
   *   - - send to openAi API
   *   - process results
   *   - save results
   *   - update cache
   */
  async runProcessingSequence(): Promise<ETaskStatus> {
    const elsAmount = this.appConfigService.openaiRate;
    const el2Process = await this.titleService.getNElementsToProcess(elsAmount);

    // No elements - no tasks
    if (!el2Process.length) {
      return ETaskStatus.SKIPPED;
    }

    const [, generatedTitles] = await Promise.all([
      this.titleService.updateElementsStatus(
        EProcessingStatus.PROCESSING,
        el2Process,
      ),
      this.openaiService.getTitlesForElements(el2Process),
    ]);

    // Modify title for each element as they are Documents
    const elsWithTitles = el2Process.map((el2P, idx) => {
      el2P.title = generatedTitles[idx];
      return el2P;
    });

    await this.titleService.updateElementsStatus(
      EProcessingStatus.COMPLETED,
      elsWithTitles,
    );

    // Update cache
    await Promise.all(
      elsWithTitles.map((el) =>
        this.cacheManager.set(el.hash, {
          title: el.title,
          status: EProcessingStatus.COMPLETED,
        }),
      ),
    );

    return ETaskStatus.SUCCESS;
  }
}
