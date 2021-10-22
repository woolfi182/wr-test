import { IsNotEmpty, IsString } from "class-validator";

export class ProcessTextInput {
  @IsNotEmpty()
  @IsString()
  data: string;
}
