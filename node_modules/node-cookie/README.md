
# Node Cookie

> Easily parse and write signed & encrypted cookies on Node.js HTTP requests.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Appveyor][appveyor-image]][appveyor-url]
[![Coveralls][coveralls-image]][coveralls-url]

<a href="http://res.cloudinary.com/adonisjs/image/upload/q_100/v1502279403/poppinss_z8uk2j.png">
<img src="http://res.cloudinary.com/adonisjs/image/upload/q_100/v1502279403/poppinss_z8uk2j.png" width="300px" align="right" vspace="20px" />
</a>

`node-cookie` makes it simpler to create **encrypted** and **signed** cookies for HTTP requests.

You can use it with any framework or library of your choice.

## See also

1. [node-req](https://npmjs.org/package/node-req)
2. [node-res](https://npmjs.org/package/node-res)

## Basic Setup

```javascript
const http = require('http')
const nodeCookie = require('node-cookie')

http.createServer(function (req, res) {

  // this will update set-cookie header on res object.
  nodeCookie.create(res, 'user', 'virk')

}).listen(3000)
```

## Signing cookies with a secret

```javascript
const http = require('http')
const nodeCookie = require('node-cookie')

http.createServer(function (req, res) {

  nodeCookie.create(res, 'user', 'virk', '16charlongsecret')

}).listen(3000)
```

## Signing & encrypting cookies with a secret

```javascript
const http = require('http')
const nodeCookie = require('node-cookie')

http.createServer(function (req, res) {

  nodeCookie.create(res, 'user', 'virk', '16charlongsecret', true)

}).listen(3000)
```

## API

<a name="module_Cookie"></a>

## Cookie
Cookie parser is a simple utility module to read
and write cookies on Node.js HTTP requests.
It supports cookie signing and encryption.

* [parse(req, [secret], [decrypt])](#module_Cookie..parse) ⇒ <code>Object</code>
* [get(req, key, [secret], [decrypt], [cookies])](#module_Cookie..get) ⇒ <code>Mixed</code>
* [unPackValue(value, secret, decrypt)](#module_Cookie..unPackValue) ⇒ <code>String</code>
* [packValue(value, [secret], [encrypt])](#module_Cookie..packValue) ⇒ <code>String</code>
* [create(res, key, value, [options], [secret], [encrypt])](#module_Cookie..create) ⇒ <code>void</code>
* [clear(res, key, [options])](#module_Cookie..clear) ⇒ <code>void</code>

<a name="module_Cookie..parse"></a>

### parse(req, [secret], [decrypt]) ⇒ <code>Object</code>
Parses cookies from HTTP header `Cookie` into
a javascript object. Also it will unsign
and decrypt cookies encrypted and signed
by this library using a secret.

**Kind**: inner method of [<code>Cookie</code>](#module_Cookie)  

| Param | Type | Default |
| --- | --- | --- |
| req | <code>http.IncomingRequest</code> |  | 
| [secret] | <code>String</code> | <code></code> | 
| [decrypt] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
nodeCookie.parse(req)

// or if cookies were signed when writing
nodeCookie.parse(req, 'SECRET')

// also if cookies were encrypted
nodeCookie.parse(req, 'SECRET', true)
```
<a name="module_Cookie..get"></a>

### get(req, key, [secret], [decrypt], [cookies]) ⇒ <code>Mixed</code>
Returns value for a single cookie by its key. It is
recommended to make use of this function when you
want to pull a single cookie. Since the `parse`
method will eagerly unsign and decrypt all the
cookies.

**Kind**: inner method of [<code>Cookie</code>](#module_Cookie)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| req | <code>http.IncomingRequest</code> |  |  |
| key | <code>String</code> |  |  |
| [secret] | <code>String</code> | <code></code> |  |
| [decrypt] | <code>Boolean</code> | <code>false</code> |  |
| [cookies] | <code>Object</code> | <code></code> | Use existing cookies object over re-parsing them from the header. |

**Example**  
```js
nodeCookie.get(req, 'sessionId')

// if cookie was signed
nodeCookie.get(req, 'sessionId', 'SECRET')

// if cookie was encrypted
nodeCookie.get(req, 'sessionId', 'SECRET', true)
```
<a name="module_Cookie..unPackValue"></a>

### unPackValue(value, secret, decrypt) ⇒ <code>String</code>
Unpack cookie value by unsigning and decrypting
it. Infact you can unpack any value packed via
the `packValue` method.

**Kind**: inner method of [<code>Cookie</code>](#module_Cookie)  

| Param | Type |
| --- | --- |
| value | <code>String</code> | 
| secret | <code>String</code> | 
| decrypt | <code>Boolean</code> | 

<a name="module_Cookie..packValue"></a>

### packValue(value, [secret], [encrypt]) ⇒ <code>String</code>
Pack the value by properly formatting,
signing and encrypting it.

**Kind**: inner method of [<code>Cookie</code>](#module_Cookie)  

| Param | Type | Default |
| --- | --- | --- |
| value | <code>String</code> |  | 
| [secret] | <code>String</code> | <code></code> | 
| [encrypt] | <code>Boolean</code> | <code>false</code> | 

<a name="module_Cookie..create"></a>

### create(res, key, value, [options], [secret], [encrypt]) ⇒ <code>void</code>
Write cookie to the HTTP response object. It will append
duplicate cookies to the `Set-Cookie` header, since
browsers discard the duplicate cookies by themselves

**Kind**: inner method of [<code>Cookie</code>](#module_Cookie)  

| Param | Type | Default |
| --- | --- | --- |
| res | <code>http.ServerResponse</code> |  | 
| key | <code>String</code> |  | 
| value | <code>\*</code> |  | 
| [options] | <code>Object</code> | <code>{}</code> | 
| [secret] | <code>String</code> | <code></code> | 
| [encrypt] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
nodeCookie.create(res, 'sessionId', 1)

// sign session id
nodeCookie.create(res, 'sessionId', 1, {}, 'SECRET')

// sign and encrypt session id
nodeCookie.create(res, 'sessionId', 1, {}, 'SECRET', true)
```
<a name="module_Cookie..clear"></a>

### clear(res, key, [options]) ⇒ <code>void</code>
Clears the cookie from browser by setting it's expiry
in past. This is required since there is no other
way to instruct the browser to delete a cookie.

Also this method will override the `expires` value on
the options object.

**Kind**: inner method of [<code>Cookie</code>](#module_Cookie)  

| Param | Type | Default |
| --- | --- | --- |
| res | <code>http.ServerResponse</code> |  | 
| key | <code>String</code> |  | 
| [options] | <code>Object</code> | <code>{}</code> | 

**Example**  
```js
nodeCookie.clear(res, 'sessionId')
```

[appveyor-image]: https://img.shields.io/appveyor/ci/thetutlage/node-cookie/master.svg?style=flat-square
[appveyor-url]: https://ci.appveyor.com/project/thetutlage/node-cookie

[npm-image]: https://img.shields.io/npm/v/node-cookie.svg?style=flat-square
[npm-url]: https://npmjs.org/package/node-cookie

[travis-image]: https://img.shields.io/travis/poppinss/node-cookie/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/poppinss/node-cookie

[coveralls-image]: https://img.shields.io/coveralls/poppinss/node-cookie/develop.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/poppinss/node-cookie 
