import {UrlStatsDto} from "../../src/url/model/dto/url-stats.dto";

export const urlStatsStub = (): UrlStatsDto => {
    return {
        startDate: '2022-05-18T14:54:43.559Z',
        lastSeenDate: "2022-05-18T19:07:05.199Z",
        redirectCount: 5
    }

}