import {Controller, Get, HttpCode, Res, Response} from "@nestjs/common";
import {UrlService} from "../service/url.service";

@Controller()
export class UrlController {
    constructor(private readonly urlService: UrlService) {
    }

    @Get('/')
    @HttpCode(200)
    healthCheck(@Res() res: Response): string {
        console.log("Welcome into URL shortener")

        return 'Welcome to url Shortener'
    }
}