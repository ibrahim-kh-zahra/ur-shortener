import {Injectable} from "@nestjs/common";

const RandExp = require("randexp");

@Injectable()
export class UniqueIdGeneratorService {
    generateRandomShortCode() {
        return new RandExp('^[0-9a-zA-Z_]{6}$').gen();
    }
}