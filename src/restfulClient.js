/**
 * Created by chencheng on 17-7-20.
 */
'use strict';

const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const file = require('async-file');
const queryString = require('querystring');

module.exports = class extends think.Service {

    /**
     * curl get
     *
     * @param {String} url
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise.<*>}
     */
    async get(url,params = {}, options = {}) {

        options = Object.assign({
            method:'get',
            url,
            params,
        },options);

        return await axios(options).then((resp) => resp.data).catch(err => think.isError(err) ? err : new Error(err));
    }

    /**
     * curl post (default Content-Type:application/x-www-form-urlencoded)
     *
     * @param {String} url
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise.<*>}
     */
    async post(url, params = {}, options = {}) {

        options = Object.assign({
            method: "post",
            url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: queryString.stringify(params),
        },options);

        return await axios(options).then((resp) => resp.data).catch(err => think.isError(err) ? err : new Error(err));
    };


    /**
     * curl post (default Content-Type:application/json)
     *
     * @param {String} url
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise.<*>}
     */
    async postJson(url, params = {}, options = {}) {

        options = Object.assign({
            method: 'post',
            url,
            headers: {
                "Content-Type": 'application/json'
            },
            data: params
        },options);

        return await axios(options).then((resp) => resp.data).catch(err => think.isError(err) ? err : new Error(err));
    };

    /**
     * restful delete
     * @param {String} url
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     */
    async del(url,params = {},options = {}) {
        options = Object.assign({
            url,
            method:'delete',
            data:params,
            headers:{
                "Content-Type":'application/json'
            }
        },options);

        return await axios(options).then((resp) => resp.data).catch(err => think.isError(err) ? err : new Error(err));
    }


    /**
     * restful put
     * @param {String} url
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     */
    async put(url,params = {},options = {}) {
        options = Object.assign({
            url,
            method:'put',
            data:params,
            headers:{
                "Content-Type":'application/json'
            }
        },options)

        return await axios(options).then((resp) => resp.data).catch(err => think.isError(err) ? err : new Error(err));
    }


    /**
     * upload file (default Content-Type:multipart/form-data)
     * 支持多文件上传
     *
     * @param {String} url
     * @param {Object} params {file1:"文件路径",...}
     * @returns {Promise.<*>}
     *
     * usage:
     *  const resp = await restClient.upload("http://localhost:3001/homeDisposeUpload",{
        file1:__dirname + '/../static/img/meinv1.jpg',
        file2:__dirname + '/../static/img/meinv2.jpg',
        field1:"test"
    });
     */
    async upload(url, params) {
        if (!params) return new Error("parameter does not exist");

        let form = new FormData();

        for (let [k, v] of Object.entries(params)) {
            if (await file.exists(v)) {
                form.append(k, fs.createReadStream(v));
            } else {
                form.append(k, v);
            }
        }

        const headers = form.getHeaders();

        return await axios.post(url, form, {headers}).then((resp) => resp.data).catch(err => think.isError(err) ? err : new Error(err));
    }

    /**
     * upload file (default Content-Type:application/octet-stream)
     *
     * @param url
     * @param filePath
     * @param options
     * @returns {Promise.<*>}
     */
    async uploadBinary(url, filePath, options = {}){

        options = Object.assign({
            method: 'post',
            url:url,
            data: fs.createReadStream(filePath),
            headers: {
                "Content-Type": "application/octet-stream",
            },
        },options);

        return await axios(options).then((resp) => resp.data).catch(err => think.isError(err) ? err : new Error(err));
    }


}
