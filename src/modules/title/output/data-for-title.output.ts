import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export enum EProcessingStatus {
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
    enum: EProcessingStatus,
    required: true,
  })
  status!: EProcessingStatus;
}
