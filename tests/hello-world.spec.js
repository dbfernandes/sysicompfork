const request = require('supertest')
let server = require('../src/server')

describe('Hello World Tests', () => {
    afterAll(async done => {
        await server.close()
        done()
    })

    it('Should return Hello World', async done => {
        await request(server)
            .get('/hello-world')
            .send()
            .expect(200)
            .expect(res => {
                expect(res.text).toBe('Hello World!')
            })
        done()
    })
})