import {HttpException, Injectable, Logger} from "@nestjs/common";
import {ShorteningUrlDto} from "../model/dto/shortening-url.dto";
import {UniqueIdGeneratorService} from "./unique-id-generator.service";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {UrlEntity, UrlEntityDocument} from "../model/entities/url.entities";
import {UrlStatsDto} from "../model/dto/url-stats.dto";
import {EntityNotFoundException} from "../exceptions/entity-not-found.exception";

@Injectable()
export class UrlService {
    private readonly logger = new Logger(UrlService.name);
    private readonly  generatorService: UniqueIdGeneratorService=new UniqueIdGeneratorService();
    constructor(
        @InjectModel(UrlEntity.name) private readonly urlEntityRepository: Model<UrlEntityDocument>) {
    }

    /**
     * User can pass a custom short code but it should be validated before storing it.
     * Validation done with two steps:
     * New short code and follow internal regex expression
     * @param shorteningUrlDto
     */
    public async shortenUrl(shorteningUrlDto: ShorteningUrlDto):Promise<UrlEntity> {
        let shortCode = shorteningUrlDto.shortCode;
        if (shortCode && shortCode.length > 0) {
            await this.validateUserShortCode(shortCode)
        } else {
            this.logger.log(`Generating unique random short code for url ${shorteningUrlDto.url}: ${shortCode}`)
            shortCode = this.generatorService.generateRandomShortCode();
        }
        const urlEntity = new UrlEntity(shorteningUrlDto.url, shortCode);
        const createdUrlEntity = await this.urlEntityRepository.create(urlEntity);
        return createdUrlEntity;

    }

    /**
     *
     * @param shortCode
     */

    public async findByShortCode(shortCode: string): Promise<UrlEntity> {
        const urlEntity = await this.urlEntityRepository.findOne({shortCode: shortCode});
        return urlEntity;
    }

    /**
     *
     * @param urlEntity
     */

    public async updateUrl(urlEntity: UrlEntity):Promise<Boolean> {
         await this.urlEntityRepository.findByIdAndUpdate(urlEntity.id,urlEntity);
         return true;

    }

    /**
     *Fetching base url from short code.Update last seen date and increase redirect count
     * @param shortCode
     */

    public async getUrl(shortCode): Promise<UrlEntity> {
        const urlEntity = await this.findByShortCode(shortCode);
        if (!urlEntity) {
            throw new EntityNotFoundException();
        }
        urlEntity.redirectCount = urlEntity.redirectCount + 1;
        this.logger.log(`Increased redirect count for ${shortCode}: ${urlEntity.redirectCount}`)
        urlEntity.lastSeenDate = new Date().toISOString();
        await this.updateUrl(urlEntity);
        return urlEntity;
    }

    /**
     *
     * @param shortCode
     */

    async getUrlStats(shortCode): Promise<UrlStatsDto> {
        const urlEntity = await this.findByShortCode(shortCode);
        if (!urlEntity) {
            this.logger.error(`Can't find entity with short code ${shortCode}`)
            throw new EntityNotFoundException();
        }
        return new UrlStatsDto(urlEntity.startDate, urlEntity.lastSeenDate, urlEntity.redirectCount);

    }

    /**
     *Validation consists of two steps,
     * new shortcode & follow internal regex
     * @param shortCode
     */
    private async validateUserShortCode(shortCode: string) {
        //Validate existence in the DB
        const urlEntity = await this.findByShortCode(shortCode);
        if (urlEntity) {
            throw new HttpException("Short code already exist", 409);
        }
        //Validate custom short code format
        const re = new RegExp("^[0-9a-zA-Z_]{4,}$");
        if (re.test(shortCode)) {
            this.logger.log(`Valid short code ${shortCode}`)
            return true;
        } else {
            this.logger.error(`Not valid short code ${shortCode}`)
            throw new HttpException('Bad short code!Not following the internal rules', 422)
        }
    }
}