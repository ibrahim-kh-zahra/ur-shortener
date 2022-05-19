import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type UrlEntityDocument = UrlEntity & Document;

@Schema({collection: 'url'})
export class UrlEntity {
    @Prop()
    shortCode: string;
    @Prop()
    url: string;
    @Prop({required: true, default: new Date().toISOString()})
    startDate: string;
    @Prop()
    lastSeenDate: string;
    @Prop({default: 0})
    redirectCount: number;

    constructor(url: string, shortCode: string) {
        this.url = url;
        this.shortCode = shortCode;

    }

}

export const UrlEntitySchema = SchemaFactory.createForClass(UrlEntity);