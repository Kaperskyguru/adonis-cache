<div align="center"><img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1557762307/poppinss_iftxlt.jpg" width="600px"></div>

# Colors
> Wrapper on top of Kleur with support for testing color calls.

[![circleci-image]][circleci-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

This module is a wrapper on top of Kleur to make it easier to test the output generated using the kleur API. The API exposed is 100% the same as kleur.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Why use this module?](#why-use-this-module)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Why use this module?
Have you ever wonder, how to test the output of function calls like the following?

```js
import { bgRed, white } from 'kleur'
assert.equal(bgRed().white('Error'), 'Error') // fails
```

Well, you can make use of modules like [strip-ansi](https://github.com/chalk/strip-ansi) to strip the ansi codes and get back the plain string.

```js
import { bgRed, white } from 'kleur'
import stripAnsi from 'strip-ansi'

assert.equal(stripAnsi(bgRed().white('Error')), 'Error') // passes
```

However, this module takes a step forward with a fake colors API, that you can use during testing to reliably test the output.

```js
import { FakeColors } from '@poppinss/colors'
const colors = new FakeColors()

assert.equal(colors.bgRed().white('Error'), 'bgRed(white(Error))') // passes
```

## Usage
Install the package from npm registry as follows:

```sh
npm i @poppinss/colors

# yarn
yarn add @poppinss/colors
```

and then use it as follows:

```ts
import { Colors } from '@poppinss/colors'
const colors = new Colors()

// API same as kleur from here
```

When wring tests, you can make your code rely on `FakeColors` object instead of the `Colors` object. For example:

```ts
import { FakeColors } from '@poppinss/colors'
const colors = new FakeColors()

// API same as kleur from here
```

[circleci-image]: https://img.shields.io/circleci/project/github/poppinss/colors/master.svg?style=for-the-badge&logo=circleci
[circleci-url]: https://circleci.com/gh/poppinss/colors "circleci"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"

[npm-image]: https://img.shields.io/npm/v/@poppinss/colors.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@poppinss/colors "npm"

[license-image]: https://img.shields.io/npm/l/@poppinss/colors?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
