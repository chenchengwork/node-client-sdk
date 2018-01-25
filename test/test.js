const assert = require('assert');
const Client = require('../index');
const path = require('path');
describe('client test', function() {
    describe('#get', function() {
        it('test get method', async function() {
            const client = new Client({
                accessKeyID: "a04d0daa30fbad5191d794f527084446",
                accessKeySecret: "6788991a041734cb794e934f470650f4",
                domain: "http://localhost:8360",
            });

            const resp = await client.get('/openAPI/test/get', {a:1});
            console.log(resp);
            assert.ok(!Client.isError(resp));
        });
    });

    describe('#post', function() {
        it('test post method', async function() {
            const client = new Client({
                accessKeyID: "a04d0daa30fbad5191d794f527084446",
                accessKeySecret: "6788991a041734cb794e934f470650f4",
                domain: "http://localhost:8360",
            });

            const resp = await client.post('/openAPI/test/post', {a: 11});
            assert.ok(!Client.isError(resp));
        });
    });

    describe('#postJson', function() {
        it('test postJson method', async function() {
            const client = new Client({
                accessKeyID: "a04d0daa30fbad5191d794f527084446",
                accessKeySecret: "6788991a041734cb794e934f470650f4",
                domain: "http://localhost:8360",
            });

            const resp = await client.postJson('/openAPI/test/postJson', {a: 11});
            assert.ok(!Client.isError(resp));
        });
    });

    describe('#put', function() {
        it('test put method', async function() {
            const client = new Client({
                accessKeyID: "a04d0daa30fbad5191d794f527084446",
                accessKeySecret: "6788991a041734cb794e934f470650f4",
                domain: "http://localhost:8360",
            });

            const resp = await client.put('/openAPI/test/put', {a: 11});
            assert.ok(!Client.isError(resp));
        });
    });

    describe('#delete', function() {
        it('test delete method', async function() {
            const client = new Client({
                accessKeyID: "a04d0daa30fbad5191d794f527084446",
                accessKeySecret: "6788991a041734cb794e934f470650f4",
                domain: "http://localhost:8360",
            });

            const resp = await client.delete('/openAPI/test/delete', {a: 11});
            assert.ok(!Client.isError(resp));
        });
    });

    describe('#upload', function() {
        it('test upload file', async function() {
            const client = new Client({
                accessKeyID: "a04d0daa30fbad5191d794f527084446",
                accessKeySecret: "6788991a041734cb794e934f470650f4",
                domain: "http://localhost:8360",
            });

            const resp = await client.upload('/openAPI/test/upload', {a: 11, file: path.resolve('./package.json')});
            assert.ok(!Client.isError(resp));
        });
    });

});
