import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsInt, ArrayMinSize } from "class-validator";

/**
 * Bad Request output class
 *
 * @example {
 *   "statusCode": 400,
 *   "message": [
 *       "data must be a string",
 *       "data should not be empty"
 *   ],
 *   "error": "Bad Request"
 * }
 */
export class BadRequestOutput {
  @IsInt()
  @ApiProperty({
    example: 400,
  })
  statusCode!: number;

  @ArrayMinSize(1)
  @ApiProperty({
    example: ["data should not be empty"],
  })
  message!: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "Bad Request",
  })
  error!: string;
}
