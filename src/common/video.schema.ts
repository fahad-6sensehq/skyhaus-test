import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
    @Prop()
    name: string;

    @Prop()
    key: string;

    @Prop()
    status: string;

    @Prop()
    link: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
