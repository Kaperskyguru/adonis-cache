<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of contents

- [Adonis Cache](#adonis-cache)
  - [Installation](#installation)
  - [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Adonis Cache

> Cache provider for AdonisJS 5

[![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

This packages makes it seamless to implement any Caching strategy in AdonisJS 5 applications.

## Installation

Install the package using either npm or yarn:

```bash
npm i @kaperskyguru/adonis-cache
# or
yarn add @kaperskyguru/adonis-cache
```

Then, configure the package using the `invoke` command:

```bash
node ace invoke @kaperskyguru/adonis-cache
```

This package works exactly the way Laravel Cache package works with ease of use and effortless to set up.

```txt
// .env

CACHE_DRIVER=file // defaults to FILE

```

## Usage

```ts
import Cache from '@ioc:Kaperskyguru/Adonis-cache'

let posts = await Cache.remember('_posts_', 60, async function () {
	return await Post.all()
})
```

## Available Methods

- **_Cache.has(name: string):_** Checks if specified name is already Cached.
- **_Cache.get(name: string):_** Retrieves a Cached content by name.
- **_Cache.set(name: string, data: any, duration: number):_** Cached a particular content with assigned name.
- **_Cache.delete(name: string):_** Deletes a Cache by name.
- **_Cache.update(name: string, data: any, duration: number):_** Updates a Cache by name.
- **_Cache.remember(name: string, duration: number, callback: Function):_** Caches content with duration.
- **_Cache.rememberForever(name: string, callback: Function):_** Caches content without duration.
- **_Cache.many(keys: Array<string>):_** Retrieves all cached content specified into an array.
- **_Cache.setMany(data: object, minutes: number):_** Caches many content mapped by name at once.

Currently adding more, have any contribution? send a PR.

This package is built as a similarity to [`laravel-cache`](https://laravel.com/docs/8.x/cache). You can learn more about the methods available there.

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[npm-url]: https://www.npmjs.com/package/@kaperskyguru/adonis-cache 'npm'
[license-url]: LICENSE.md 'license'
