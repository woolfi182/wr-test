import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { EProcessingStatus } from "../output";

@Schema({
  timestamps: true,
})
export class Title {
  @Prop()
  title: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  hash: string;

  @Prop({
    required: true,
  })
  text: string;

  @Prop({
    required: true,
    index: true,
    enum: EProcessingStatus,
  })
  status: EProcessingStatus;
}

export type TitleDocument = Title & Document;
export const TitleSchema = SchemaFactory.createForClass(Title);
