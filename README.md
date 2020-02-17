# A client library from Granny server
A library for Granny image delivery server

[![npm](https://img.shields.io/npm/v/granny?style=for-the-badge)](https://www.npmjs.com/package/granny) 
[![Join the chat at https://gitter.im/granny-js/community](https://img.shields.io/gitter/room/granny-js/community?style=for-the-badge)](https://gitter.im/granny-js/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Ecosystem
![image](https://user-images.githubusercontent.com/993910/74678258-8f250380-51cb-11ea-9b5e-1640e713380e.PNG)

[granny-server-backend](https://github.com/mrspartak/granny-server-backend "granny-server-backend") - Backend service with API exposed to upload and serve/manipulate images  
[granny-js-client](https://github.com/mrspartak/granny-js-client "granny-js-client") - Client library that works both in nodejs and browser. Makes API calls easier  
[granny-server-frontend](https://github.com/mrspartak/granny-server-frontend "granny-server-frontend") - Frontend APP that uses client to manage your CDN domains and settings  
[granny-server-cron](https://github.com/mrspartak/granny-server-cron "granny-server-cron") - Utility app  

## Setup
This library can be used in both nodejs and browser environment. Browser clint made only for staging or admin panel development, because you can expose your credentials in browser.

**NPM**
```
npm i granny
```

**Building from source**
```
git clone git@github.com:mrspartak/granny-js-client.git
cd granny-js-client

//if you need browser version
npm run build
//request to your browser build/index.js

//if you need nodejs version it is stored in src/index.js
```

**Or download latest release**  
[![npm](https://img.shields.io/npm/v/granny?style=for-the-badge)](https://github.com/mrspartak/granny-js-client/releases)

## Basic usage
Nodejs
```js
const Granny = require('granny')

const grannyApi = new Granny({
	domain: 'https://cdn.example.com',
	accessKey: 'key',
	accessSecret: 'secret'
})

var [err, result] = await grannyApi.uploadImage({path: '/users/sergio.jpeg', image: './tmp/DSCF6278.jpg'})
console.log(result.imageUrl)
```

## API
Currently here: https://github.com/mrspartak/granny-js-client/blob/master/API.md
