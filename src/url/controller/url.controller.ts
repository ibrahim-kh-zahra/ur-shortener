import {Body, Controller, Get, Param, Post, Response, UseFilters, UsePipes, ValidationPipe} from "@nestjs/common";
import {ShorteningUrlDto} from "../model/dto/shortening-url.dto";
import {HttpExceptionsFilter} from "../exceptions/filters/http-exceptions-filter";
import {UrlService} from "../service/url.service";
import {UrlStatsDto} from "../model/dto/url-stats.dto";

@Controller('url')
export class UrlController {
    constructor(private readonly urlService: UrlService) {
    }

    /**
     *
     * @param data
     */
    @Post('shorten')
    @UsePipes(ValidationPipe)
    @UseFilters(new HttpExceptionsFilter())
    shortenUrl(@Body() data: ShorteningUrlDto) {
        return this.urlService.shortenUrl(data);
    }

    /**
     *
     * @param data
     */
    @Get('/:shortCode')
    @UsePipes(ValidationPipe)
    @UseFilters(new HttpExceptionsFilter())
    async getUrlShortCode(@Response() res, @Param('shortCode') shortCode) {
        const urlEntity = await this.urlService.getUrl(shortCode);
        return res.set({'Location': urlEntity.url}).json({})
    }

    /**
     *
     * @param data
     */
    @Get('/:shortCode/stats')
    @UsePipes(ValidationPipe)
    @UseFilters(new HttpExceptionsFilter())
    async getUrlStats(@Param('shortCode') shortCode): Promise<UrlStatsDto> {
        return await this.urlService.getUrlStats(shortCode);
    }
}