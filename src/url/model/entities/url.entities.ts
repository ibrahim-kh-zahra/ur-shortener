import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, ObjectId} from 'mongoose';
import mongoose from "mongoose";

export type UrlEntityDocument = UrlEntity & Document;

@Schema({collection: 'url'})
export class UrlEntity {
    @Prop({ type: mongoose.Schema.Types.ObjectId, name: 'id' })
    id:ObjectId
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