import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ProcessTextInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: "Some chunk of data",
  })
  data: string;
}
