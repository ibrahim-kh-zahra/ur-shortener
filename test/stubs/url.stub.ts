import {UrlEntity} from "../../src/url/model/entities/url.entities";

export const urlStub = (): UrlEntity => {
    return {
        shortCode: "example",
        url: "www.example.com",
        startDate: '2022-05-18T14:54:43.559Z',
        lastSeenDate: "2022-05-18T19:07:05.199Z",
        redirectCount: 5
    }

}