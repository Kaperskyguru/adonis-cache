# Fancy Logger
> Fancy logger used by AdonisJS CLI apps

[![circleci-image]][circleci-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

Fancy logger for logging colorful messages with consistent UI output. AdonisJs has various command line utilities including [ace](https://github.com/adonisjs/ace). (A framework to create CLI applications). We make use of this module to make sure that all parts of the framework output logs with consistent formatting.

A big thanks to the creator of [signale](https://github.com/klaussinani/signale) for being an inspiration for this module.

We didn't used signale coz of following reasons:

1. AdonisJs uses kleur for colorizing strings and signale uses chalk. We want to avoid loading different color libraries.
2. Signale has too many features that we don't need.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Using a custom instance](#using-a-custom-instance)
- [Deferred logs](#deferred-logs)
- [Testing log messages](#testing-log-messages)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
Install the package from npm registry as follows:

```sh
npm i @poppinss/fancy-logs

# yarn
yarn add @poppinss/fancy-logs
```

## Usage
Import and use the logger as follows

```ts
import fancyLogger from '@poppinss/fancy-logs'

fancyLogger.success('Operation successful')
fancyLogger.info('Hello from L59')
fancyLogger.pending('Write release notes for %s', '1.2.0')
fancyLogger.fatal(new Error('Unable to acquire lock'))
fancyLogger.watch('Recursively watching build directory...')
fancyLogger.complete({
  prefix: '[task]',
  message: 'Fix issue #59',
})
```

![](./fancy-logs.png)

## Using a custom instance

```ts
import { Logger } from '@poppinss/fancy-logs'

/**
 * Disable underlines and icons
*/
const fancyLogger = new Logger({
  underline: false,
  icon: false,
  color: true
})
```

## Deferred logs
When running CLI tasks from 3rd party plugins, you may end in a situation where multiple plugins will print the same log messages. For example:

**Plugin A updates `tsconfig.json`**
```
logger.update('tsconfig.json')
```

**Plugin B update `tsconfig.json` with a different option but logs the same message**
```
logger.update('tsconfig.json')
```

After this the CLI will reflect 2 lines saying `update  tsconfig.json`. You can avoid this behavior by pausing and resuming the logger.

```ts
logger.pauseLogger()

runPluginA()
runPluginB()

const logsSet = new Set()
logger.resumeLogger((message) => {
  if (logsSet.has(message.message)) {
    return false
  }

  logsSet.add(message.message)
  return true
})
```

The callback passed to `resumeLogger` must return `true` when it wants to print a message and `false` for opposite behavior.

## Testing log messages
You can also safely test the log messages by creating an instance with `fake=true`. For example:

```ts
import { Logger } from '@poppinss/fancy-logs'

const logger = new Logger({ fake: true })

logger.warn('Fire in the hole')
logger.info('Account created')

assert.deepEqual(logger.logs, [
  'underline(yellow(warn)) Fire in the hole',
  'underline(blue(info)) Account created'
])
```

[circleci-image]: https://img.shields.io/circleci/project/github/poppinss/fancy-logs/master.svg?style=for-the-badge&logo=circleci
[circleci-url]: https://circleci.com/gh/poppinss/fancy-logs "circleci"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"

[npm-image]: https://img.shields.io/npm/v/@poppinss/fancy-logs.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@poppinss/fancy-logs "npm"

[license-image]: https://img.shields.io/npm/l/@poppinss/fancy-logs?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
