## node-client-sdk

###  一、版本要求
```
Node > 8.9.1

```

### 二、使用方法
```
const Client = require("node-client-sdk");

const client = new Client({
    accessKeyID: "a04d0daa30fbad5191d794f527084441",
    accessKeySecret: "6788991a041734cb794e934f470650f1",
    domain: "http://localhost",
});

const result = await client.get('/openAPI/test/get', {a:1});

// Content-Type: 'application/x-www-form-urlencoded'
const resp = await client.post('/openAPI/test/post', {a: 11});

// Content-Type: 'application/json'
const result = await client.postJson('/openAPI/test/postJson', {a: 11});

// Content-Type: 'application/json'
const result = await client.put('/openAPI/test/put', {a: 11});

// Content-Type: 'application/json'
const result = await client.delete('/openAPI/test/delete', {a: 11});

// Content-Type: 'multipart/form-data'
const result = await client.upload('/openAPI/test/upload', {a: 11, file: path.resolve('./package.json')});

if (Client.isError(resp)) throw result

console.log(result);

```
