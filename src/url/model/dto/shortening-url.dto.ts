import {IsNotEmpty} from "class-validator";

export class ShorteningUrlDto {
    @IsNotEmpty({message: "Url must exists"})
    url: string;
    shortCode: string;
}