export class UrlStatsDto {
    startDate: string;
    lastSeenDate: string;
    redirectCount: number;

    constructor(startDate: string, lastSeenDate: string, redirectCount: number) {
        this.startDate = startDate;
        this.lastSeenDate = lastSeenDate;
        this.redirectCount = redirectCount;
    }
}