import {Module} from '@nestjs/common';
import {UrlModule} from './url/url.module';
import * as config from 'config';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [UrlModule,
        ConfigModule.forRoot({isGlobal: true}),
        MongooseModule.forRoot(config.get('mongodb.url'))
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
