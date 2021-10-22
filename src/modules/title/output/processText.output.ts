import { IsNotEmpty, IsString } from "class-validator";

export enum EProcessTextStatus {
  COMPLETED = "completed",
  ERROR = "error",
  QUEUED = "queued",
}

export class ProcessTextOutput {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  status: EProcessTextStatus;
}
