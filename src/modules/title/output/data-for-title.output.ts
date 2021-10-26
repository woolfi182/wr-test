import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export enum EProcessingStatus {
  COMPLETED = "completed",
  ERROR = "error",
  QUEUED = "queued",
  PROCESSING = "processing",
}

export enum EResponseStatus {
  COMPLETED = "completed",
  ERROR = "error",
  QUEUED = "queued",
}

export class DataForTitleOutput {
  @IsString()
  @ApiPropertyOptional({
    example: "Heros could fly",
  })
  title?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    enum: EResponseStatus,
    required: true,
  })
  status!: EResponseStatus;
}
