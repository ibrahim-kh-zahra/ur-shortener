import {Test, TestingModule} from "@nestjs/testing";
import {UniqueIdGeneratorService} from "./unique-id-generator.service";

describe('UniqueIdGeneratorService', () => {
    let service: UniqueIdGeneratorService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                UniqueIdGeneratorService,
            ],
            providers: [UniqueIdGeneratorService]
        }).compile();
        service = module.get<UniqueIdGeneratorService>(UniqueIdGeneratorService);
    })
    it('should be defined', () => {
        expect(UniqueIdGeneratorService).toBeDefined();
    })
    it('generate random value with length 6', () => {
        expect(service.generateRandomShortCode().length).toBe(6)
    })
    it('generated random follow the predefined regex', () => {
        const generatedValue = service.generateRandomShortCode();
        expect(/^[0-9a-zA-Z_]{6}$/.test(generatedValue)).toBe(true)
    })
})