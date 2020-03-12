# smpltmpl

[![Build Status](https://travis-ci.org/sapegin/smpltmpl.svg)](https://travis-ci.org/sapegin/smpltmpl)

Simple templates for Node.js based on ECMAScript [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) syntax.

## Installation

```bash
npm install --save smpltmpl
```

## Usage

Using a string:

```js
const { template } = require('smpltmpl');
console.log(template('Hello ${who}!', { who: 'templates' }));
```

Using a template file:

```js
const { templateFromFile } = require('smpltmpl');
console.log(templateFromFile('template.txt', { who: 'templates' }));
```

## Change log

The change log can be found on the [Releases page](https://github.com/sapegin/smpltmpl/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[Artem Sapegin](http://sapegin.me) and [contributors](https://github.com/sapegin/smpltmpl/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
