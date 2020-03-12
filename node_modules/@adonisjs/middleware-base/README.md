# Adonis Middleware Base :triangular_ruler:

This repo contains the code to make middleware work with the HTTP and Websocket server. If you are looking for generic middleware library, try [co-compose](https://www.npmjs.com/package/co-compose).

<br />
<hr />
<br />

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Appveyor][appveyor-image]][appveyor-url]
[![Coveralls][coveralls-image]][coveralls-url]

<img src="http://res.cloudinary.com/adonisjs/image/upload/q_100/v1497112678/adonis-purple_pzkmzt.svg" width="200px" align="right" hspace="30px" vspace="140px">

## Usage
```
const MiddlewareBase = require('@adonisjs/middleware-base')

const middleware = MiddlewareBase('handle')

// register global middleware
middleware.registerGlobal(['App/Middleware/BodyParser'])

await middleware
  .getGlobalAndNamed([])
  .params([ctx])
  .run()
```

## Classes

<dl>
<dt><a href="#MiddlewareBase">MiddlewareBase</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#registerGlobal">registerGlobal(middleware)</a> ⇒ <code>void</code></dt>
<dd><p>Register global middleware</p>
</dd>
<dt><a href="#use">use(middleware)</a> ⇒ <code>void</code></dt>
<dd><p>Register server type middleware</p>
</dd>
<dt><a href="#registerNamed">registerNamed(middleware)</a> ⇒ <code>void</code></dt>
<dd><p>Register an object of named middleware</p>
</dd>
<dt><a href="#composeServer">composeServer()</a> ⇒ <code>Runner</code></dt>
<dd><p>Composes server level middleware</p>
</dd>
<dt><a href="#composeGlobalAndNamed">composeGlobalAndNamed(namedReference)</a> ⇒ <code>Runner</code></dt>
<dd><p>Composes global and named middleware together. Pass empty
array when no named middleware are supposed to be
executed.</p>
</dd>
</dl>

<a name="MiddlewareBase"></a>

## MiddlewareBase
**Kind**: global class  
<a name="new_MiddlewareBase_new"></a>

### new MiddlewareBase(middlewareFn, [warnFn])
MiddlewareBase class is a simple abstraction written to
work just with AdonisJs middleware layer.

Adonis has global, named and server middleware with a slight
difference in each. So this class understands all and offers
a simple abstraction around them.


| Param | Type | Description |
| --- | --- | --- |
| middlewareFn | <code>String</code> | The function to be called on middleware class |
| [warnFn] | <code>function</code> |  |

<a name="registerGlobal"></a>

## registerGlobal(middleware) ⇒ <code>void</code>
Register global middleware

**Kind**: global function  
**Throws**:

- <code>InvalidArgumentException</code> If middleware is not an array


| Param | Type |
| --- | --- |
| middleware | <code>Array</code> | 

**Example**  
```js
middleware.registerGlobal([
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session'
])
```
<a name="use"></a>

## use(middleware) ⇒ <code>void</code>
Register server type middleware

**Kind**: global function  
**Throws**:

- <code>InvalidArgumentException</code> If middleware is not an array


| Param | Type |
| --- | --- |
| middleware | <code>Array</code> | 

**Example**  
```js
middleware.use(['Adonis/Middleware/Static'])
```
<a name="registerNamed"></a>

## registerNamed(middleware) ⇒ <code>void</code>
Register an object of named middleware

**Kind**: global function  
**Throws**:

- <code>InvalidArgumentException</code> If middleware is not an object with key/value pair.


| Param | Type |
| --- | --- |
| middleware | <code>Object</code> | 

**Example**  
```js
middleware.registerNamed({
  auth: 'Adonis/Middleware/Auth'
})
```
<a name="composeServer"></a>

## composeServer() ⇒ <code>Runner</code>
Composes server level middleware

**Kind**: global function  
<a name="composeGlobalAndNamed"></a>

## composeGlobalAndNamed(namedReference) ⇒ <code>Runner</code>
Composes global and named middleware together. Pass empty
array when no named middleware are supposed to be
executed.

**Kind**: global function  

| Param | Type |
| --- | --- |
| namedReference | <code>Array</code> | 


[appveyor-image]: https://img.shields.io/appveyor/ci/thetutlage/adonis-middleware-base/master.svg?style=flat-square
[appveyor-url]: https://ci.appveyor.com/project/thetutlage/adonis-middleware-base

[npm-image]: https://img.shields.io/npm/v/@adonisjs/middleware-base.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@adonisjs/middleware-base

[travis-image]: https://img.shields.io/travis/adonisjs/adonis-middleware-base/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/adonisjs/adonis-middleware-base

[coveralls-image]: https://img.shields.io/coveralls/adonisjs/adonis-middleware-base/develop.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/adonisjs/adonis-middleware-base
