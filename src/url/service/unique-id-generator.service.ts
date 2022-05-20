import {Logger} from "@nestjs/common";

const RandExp = require("randexp");

/**
 * Responsible for generating random string values with length 6.For the purpose of creating alias code for URLs
 */
export class UniqueIdGeneratorService {
    private readonly logger = new Logger(UniqueIdGeneratorService.name);
    generateRandomShortCode() {
        const generatedRandomValue= new RandExp('^[0-9a-zA-Z_]{6}$').gen();
        this.logger.log(`Generate random value ${generatedRandomValue}`);
        return generatedRandomValue;
    }
}