import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import * as request from 'supertest'

const RandExp = require("randexp");

function generateRandomShortCode() {
    const generatedRandomString = new RandExp('^[0-9a-zA-Z_]{4}$').gen();
    return generatedRandomString
}

describe('URL controller e2e tests ', () => {
    let app: INestApplication;
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    })


    it('Fetch url details,normal flow ', (done) => {
        request(app.getHttpServer()).get('/url/example').set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
    it('Wrong shortcode in the request:Not found in the DB ', (done) => {
        request(app.getHttpServer()).get('/url/wyz')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404, done);
    })
    it('Shorten Url test,normal flow', (done) => {
        const generatedRandomString = generateRandomShortCode();
        request(app.getHttpServer()).post('/url/shorten').send({
            shortCode: generatedRandomString,
            url: "www.x.com"
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201, done);
    })
    it('Missing url field from from shortenUrl request', (done) => {
        const generatedRandomString = generateRandomShortCode();

        request(app.getHttpServer()).post('/url/shorten').send({
            shortCode: generatedRandomString,
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, done);
    })
    it('Wrong shortcode value,not following the regex', (done) => {
        request(app.getHttpServer()).post('/url/shorten').send({
            shortCode: '@',
            url: 'www.xxx.com'
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422, done);
    })
    it('Get Url stats,Normal flow test', (done) => {
        request(app.getHttpServer()).get('/url/example/stats')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
    it('Fetching stats for Not existing short code ', (done) => {
        request(app.getHttpServer()).get('/url/wyz/stats')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404, done);
    })

})