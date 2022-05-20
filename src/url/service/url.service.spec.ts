import {UrlService} from "./url.service";
import * as sinon from 'sinon'
import {Test, TestingModule} from "@nestjs/testing";
import {UrlEntity} from "../model/entities/url.entities";
import {getModelToken} from "@nestjs/mongoose";
import {ShorteningUrlDto} from "../model/dto/shortening-url.dto";

describe('UrlService', () => {
    let urlService: UrlService;
    let sandBox: sinon.SinonSandbox
    beforeAll(async () => {
        sandBox = sinon.createSandbox();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UrlService, {
                    provide: getModelToken(UrlEntity.name),
                    useValue: UrlEntity,
                }
            ]
        }).compile()
    })
    it('should call shortenUrl with expected params', async () => {
        const shortenUrlSpy = jest.spyOn(urlService, 'shortenUrl');
        const urlEntityDto = new ShorteningUrlDto();
        await urlService.shortenUrl(urlEntityDto);
        expect(shortenUrlSpy).toHaveBeenCalledWith(urlEntityDto)


    })
})