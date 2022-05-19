import {HttpException, HttpStatus} from "@nestjs/common";

export class EntityNotFoundException extends HttpException {
    constructor() {
        super('Url entity not found', HttpStatus.NOT_FOUND);
    }
}