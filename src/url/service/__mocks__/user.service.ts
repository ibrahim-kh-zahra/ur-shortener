import {urlStub} from "../../../../test/stubs/url.stub";
import {UrlEntity} from "../../model/entities/url.entities";
import {urlStatsStub} from "../../../../test/stubs/url-stats.stub";

export const UserService=jest.fn().mockReturnValue({
    shortenUrl:jest.fn().mockReturnValue(urlStub()),
    findByShortCode:jest.fn().mockReturnValue(urlStub()),
    getUrl:jest.fn().mockReturnValue(urlStub()),
    getUrlStats:jest.fn().mockReturnValue(urlStatsStub),
    updateUrl:jest.fn().mockReturnValue(true)
    ,
})