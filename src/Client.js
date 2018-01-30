'use strict';

const assert = require('assert');
const debug = require('debug')('client:sdk');
const fs = require('fs');
const axios = require('tj-axios');
const kitx = require('kitx');
const queryString = require('querystring');
const file = require('async-file');
const FormData = require('form-data');

class Client {

    /**
     * 验证是否是错误对象
     * @param value
     * @return {boolean}
     */
    static isError(value) {
        return value instanceof Error;
    }

    /**
     *
     * @param {Object} opts
     * @param {String} opts.accessKeyID
     * @param {String} opts.accessKeySecret
     * @param {String} opts.domain
     */
    constructor(opts) {
        assert(opts, 'must pass in "opts"');
        const { accessKeyID, accessKeySecret, domain } = opts;

        assert(accessKeyID, 'must pass in "opts.accessKeyID"');
        this.accessKeyID = accessKeyID;

        assert(accessKeySecret, 'must pass in "opts.accessKeySecret"');
        this.accessKeySecret = accessKeySecret;

        this.domain = domain;
    }

    async request(method, uri, requestBody, urlParams = {}, opts = {}) {
        const url = `${this.domain}${uri}`;

        debug('url: %s', url);
        debug('method: %s', method);
        const headers = this.buildHeaders(
            method,
            requestBody,
            Object.keys(urlParams).length > 0 ? `${uri}?${queryString.stringify(urlParams)}` : uri,
            opts.headers || {}
        );

        debug('request headers: %j', headers);
        requestBody && debug('request body: %s', requestBody.toString());

        const response = await axios(Object.assign(opts, {
            url,
            method: method,
            headers: headers,
            params: urlParams,
            data: requestBody
        })).then(resp => resp.data).catch(e => Client.isError(e) ? e : new Error(e));

        return response;
    }

    /**
     * rest get method
     * @param {String} uri
     * @param {Object} params
     * @param {Object} opts
     * @return {Promise<void>}
     */
    async get(uri, params = {}, opts = {}) {

        return await this.request('GET', uri, null, params, opts);
    }

    /**
     * rest post method
     * @param {String} uri
     * @param {Object} body
     * @param {Object} opts
     * @return {Promise<void>}
     */
    async post(uri, body = {}, opts = {}) {
        opts = Object.assign({
            headers:{
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        }, opts);

        return await this.request('POST', uri, queryString.stringify(body), {}, opts);
    }

    /**
     * rest postJson method
     * @param {String} uri
     * @param {Object} body
     * @param {Object} opts
     * @return {Promise<void>}
     */
    async postJson(uri, body = {}, opts = {}) {
        opts = Object.assign({
            headers:{
                "Content-Type": 'application/json'
            }
        }, opts);

        return await this.request('POST', uri, body, {}, opts);
    }

    /**
     * rest put method
     * @param {String} uri
     * @param {Object} body
     * @param {Object} opts
     * @return {Promise<void>}
     */
    async put(uri, body = {}, opts = {}) {
        opts = Object.assign({
            headers:{
                "Content-Type": 'application/json'
            }
        }, opts);

        return await this.request('PUT', uri, body, {}, opts);
    }

    /**
     * rest delete method
     * @param {String} uri
     * @param {Object} body
     * @param {Object} opts
     * @return {Promise<void>}
     */
    async delete(uri, body = {}, opts = {}) {
        opts = Object.assign({
            headers:{
                "Content-Type": 'application/json'
            }
        }, opts);

        return await this.request('DELETE', uri, body, {}, opts);
    }

    /**
     * upload file (default Content-Type:multipart/form-data)
     * 支持多文件上传
     *
     * @param {String} uri
     * @param {Object} params {file1:"文件路径",...}
     * @param {Object} [opts]
     * @param {Object} [formOpts] https://github.com/felixge/node-combined-stream/blob/master/lib/combined_stream.js#L7-L15
     * @returns {Promise.<*>}
     *
     * usage:
     *  const resp = await restClient.upload("http://localhost:3001/homeDisposeUpload",{
        file1:__dirname + '/../static/img/meinv1.jpg',
        file2:__dirname + '/../static/img/meinv2.jpg',
        field1:"test"
    });
     */
    async upload(uri, params, opts = {maxBodyLength: 200 * 1024 * 1024}, formOpts = { maxDataSize: 500 * 1024 * 1024 }) {
        if (!params) return new Error("parameter does not exist");

        let form = new FormData(formOpts);

        for (let [k, v] of Object.entries(params)) {
            if (typeof v === 'string' && await file.exists(v)) {
                form.append(k, fs.createReadStream(v));
            } else {
                form.append(k, v);
            }
        }

        const headers = form.getHeaders();

        return await this.request('POST', uri, form, {}, Object.assign({
                headers: {
                    "Content-Type": headers['content-type']
                }
            }, opts));
    }

    /**
     * 生成header
     * @param method
     * @param body
     * @param url
     * @param customHeaders
     * @return {{"x-date": *, "x-host": String|*}}
     */
    buildHeaders(method, body, url, customHeaders = {}) {
        const date = new Date().toGMTString();
        const headers = {
            'x-date': date,
            'x-host': this.domain,
        };

        if (method !== 'GET' && method !== 'HEAD' && !(customHeaders['Content-Type'].indexOf('multipart/form-data') > -1)) {
            const digest = kitx.md5(body.toString(), 'hex');
            const md5 = Buffer.from(digest, 'utf8').toString('base64');

            Object.assign(headers, {
                'x-content-md5': md5
            });
        }

        Object.assign(headers, customHeaders);

        const signature = this.sign(method, headers, url);

        headers['authorization'] = `${this.accessKeyID}:${signature}`;

        return headers;
    }


    /**
     * 生成签名
     * @param {String} method
     * @param {Object} headers
     * @param {String} url
     * @return {string}
     */
    sign(method, headers, url) {
        const md5 = headers['x-content-md5'] || '';
        const date = headers['x-date'];

        const toSignString = `${method}\n${md5}\n${date}\n${url}`;

        const buff = Buffer.from(toSignString, 'utf8');
        const degist = kitx.sha1(buff, this.accessKeySecret, 'binary');
        return Buffer.from(degist, 'binary').toString('base64');
    }
}

module.exports = Client;
