import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsInt } from "class-validator";

/**
 * Internal server error output class
 *
 * @example {
 *   "statusCode": 500,
 *   "message": "Internal server error"
 * }
 */
export class InternalServerErrorOutput {
  @IsInt()
  @ApiProperty({
    example: 500,
  })
  statusCode!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "Internal server error",
  })
  message!: string;
}
