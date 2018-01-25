'use strict';

const assert = require('assert');

const debug = require('debug')('client:sdk');
// const httpx = require('httpx');
const axios = require('axios');
const kitx = require('kitx');
const queryString = require('querystring');

// const {
//     getEndpoint,
//     toXMLBuffer,
//     parseXML,
//     extract,
//     getResponseHeaders,
//     getCanonicalizedMNSHeaders
// } = require('./helper');

class Client {

    /**
     *
     * @param {Object} opts
     * @param {String} opts.accessKeyID
     * @param {String} opts.accessKeySecret
     * @param {String} opts.securityToken
     * @param {String} opts.domain
     */
    constructor(opts) {
        assert(opts, 'must pass in "opts"');

        const { accessKeyID, accessKeySecret, securityToken, domain } = opts;

        assert(accessKeyID, 'must pass in "opts.accessKeyID"');
        this.accessKeyID = accessKeyID;

        assert(accessKeySecret, 'must pass in "opts.accessKeySecret"');
        this.accessKeySecret = accessKeySecret;

        this.domain = domain;

        // security token
        this.securityToken = securityToken;
    }

    async request(method, uri, requestBody, urlParams, opts = {}) {

        const url = `${this.domain}${uri}`;
        debug('url: %s', url);
        debug('method: %s', method);
        const headers = this.buildHeaders(method, requestBody, uri, opts.headers || {});

        // debug('request headers: %j', headers);
        requestBody && debug('request body: %s', requestBody.toString());

        const response = await axios(Object.assign(opts, {
            url,
            method: method,
            headers: headers,
            params: urlParams,
            data: requestBody
        }));

        return response;


        debug('statusCode %s', response.statusCode);
        debug('response headers: %j', response.headers);
        const code = response.statusCode;

        const contentType = response.headers['content-type'] || '';
        const responseBody = await httpx.read(response, 'utf8');
        debug('response body: %s', responseBody);

        var body;
        if (responseBody && contentType.startsWith('text/xml')) {
            const responseData = await parseXML(responseBody);

            if (responseData.Error) {
                const e = responseData.Error;
                const message = extract(e.Message);
                const requestid = extract(e.RequestId);
                const hostid = extract(e.HostId);
                const err = new Error(`${method} ${url} failed with ${code}. ` +
                    `requestid: ${requestid}, hostid: ${hostid}, message: ${message}`);
                err.name = 'MNS' + extract(e.Code) + err.name;
                throw err;
            }

            body = {};
            Object.keys(responseData[type]).forEach((key) => {
                if (key !== '$') {
                body[key] = extract(responseData[type][key]);
            }
        });
        }

        return {
            code,
            headers: getResponseHeaders(response.headers, attentions),
            body: body
        };
    }

    get(uri, params = {}, opts = {}) {

        return this.request('GET', uri, null, params, opts);
    }

    put(uri, body, opts = {}) {
        opts = Object.assign({
            headers:{
                "Content-Type":'application/json'
            }
        }, opts);

        return this.request('PUT', uri, body, {}, opts);
    }

    post(uri, body = {}, opts = {}) {
        opts = Object.assign({
            headers:{
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        }, opts);
        return this.request('POST', uri, queryString.stringify(body), {}, opts);
    }

    delete(uri, body, opts = {}) {
        opts = Object.assign({
            headers:{
                "Content-Type":'application/json'
            }
        }, opts);

        return this.request('DELETE', uri, body, {}, opts);
    }

    // 生成签名
    sign(method, headers, uri) {
        const md5 = headers['x-content-md5'] || '';
        const date = headers['x-date'];

        const toSignString = `${method}\n${md5}\n${date}\n${uri}`;

        const buff = Buffer.from(toSignString, 'utf8');
        const degist = kitx.sha1(buff, this.accessKeySecret, 'binary');
        return Buffer.from(degist, 'binary').toString('base64');
    }

    buildHeaders(method, body, uri, customHeaders) {
        const date = new Date().toGMTString();

        const headers = {
            'x-date': date,
            'x-host': this.domain,
        };

        if (method !== 'GET' && method !== 'HEAD') {
            const digest = kitx.md5(body.toString(), 'hex');
            const md5 = Buffer.from(digest, 'utf8').toString('base64');

            Object.assign(headers, {
                'x-content-md5': md5
            });
        }

        Object.assign(headers, customHeaders);

        const signature = this.sign(method, headers, uri);

        headers['authorization'] = `${this.accessKeyID}:${signature}`;

        return headers;
    }
}

module.exports = Client;
