const queryString = require('querystring');
const URL = require('url').URL;
const url = new URL('http://a.com/user/a?a=1');
console.log(url.pathname)
