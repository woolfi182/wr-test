import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export enum EProcessTextStatus {
  COMPLETED = "completed",
  ERROR = "error",
  QUEUED = "queued",
}

export class ProcessTextOutput {
  @IsString()
  @ApiPropertyOptional({
    example: "Heros could fly",
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    enum: EProcessTextStatus,
    required: true,
  })
  status: EProcessTextStatus;
}
