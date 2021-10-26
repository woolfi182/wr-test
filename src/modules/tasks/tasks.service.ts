import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { OpenAiService } from "../openai/openai.service";
import { TitleService } from "../title/title.service";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  interval = 5; // 5 sec

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private openaiService: OpenAiService,
    @Inject(forwardRef(() => TitleService))
    private titleService: TitleService,
  ) {}

  addInterval() {
    const callback = () => {
      this.logger.warn("Interval executing at time (1 sec!");
    };

    const fetchDataInterval = setInterval(callback, 1000);
    this.schedulerRegistry.addInterval("rate", fetchDataInterval);
  }

  handleCron() {
    this.logger.debug("Called when the current second is 45");
  }

  checkIfTriggerTask() {
    console.log("here");
  }
}
