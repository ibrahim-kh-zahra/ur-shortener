import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {LoggingMiddleware} from "./middleware/logging.middleware";
import {UrlController} from "./controller/url.controller";
import {UrlService} from "./service/url.service";
import {UniqueIdGeneratorService} from "./service/unique-id-generator.service";
import {MongooseModule} from "@nestjs/mongoose";
import {UrlEntity, UrlEntitySchema} from "./model/entities/url.entities";

@Module({
    imports: [
        MongooseModule.forFeature([{name: UrlEntity.name, schema: UrlEntitySchema}]),

    ],
    controllers: [UrlController],
    providers: [UrlService, UniqueIdGeneratorService],
})
export class UrlModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggingMiddleware).forRoutes(UrlController);
    }
}
