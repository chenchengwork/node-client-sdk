const assert = require('assert');
const Client = require('../index');

describe('client test', function() {
    describe('#get', function() {

        it('test get method', async function() {
            const client = new Client({
                accessKeyID: "accessKeyID",
                accessKeySecret: "accessKeySecret",
                securityToken: "securityToken",
                domain: "http://localhost:8360",
            });

            const resp = await client.get('/openAPI/test/get', {a:1});
            console.log(resp.data);
        });
    });

    describe('#post', function() {
        it('test post method', async function() {
            const client = new Client({
                accessKeyID: "accessKeyID",
                accessKeySecret: "accessKeySecret",
                securityToken: "securityToken",
                domain: "http://localhost:8360",
            });

            const resp = await client.post('/openAPI/test/post', {a: 11});
            console.log(resp.data);
        });
    });

    describe('#put', function() {
        it('test put method', async function() {
            const client = new Client({
                accessKeyID: "accessKeyID",
                accessKeySecret: "accessKeySecret",
                securityToken: "securityToken",
                domain: "http://localhost:8360",
            });

            const resp = await client.put('/openAPI/test/put', {a: 11});
            console.log(resp.data);
        });
    });

    describe('#delete', function() {
        it('test delete method', async function() {
            const client = new Client({
                accessKeyID: "accessKeyID",
                accessKeySecret: "accessKeySecret",
                securityToken: "securityToken",
                domain: "http://localhost:8360",
            });

            const resp = await client.delete('/openAPI/test/delete', {a: 11});
            console.log(resp.data);
        });
    });

});
