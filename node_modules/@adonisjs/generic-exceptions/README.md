# AdonisJs Generic Exceptions 🚀
> Customized exceptions for AdonisJs

[![NPM Version][npm-image]][npm-url]

This repo contains some helpful classes to throw uniform exceptions through out the application. Ofcourse you can throw exceptions using `new Error()` but using this package will help in throwing informative exceptions.

## Setup
Install package using npm.

```js
npm i @adonisjs/generic-exceptions
```

## Usage
The package exports 4 different exceptions, defined as follows.

```js
const { InvalidArgumentException } = require('@adonisjs/generic-exceptions')

const message = 'Model.create requires an object'
const status = 400
const code = 'E_INVALID_ARGUMENT'

throw new InvalidArgumentException(message, status, code)
```

The `status` must be a valid HTTP status code and `code` is a unique error code to recognize an exception. AdonisJs error codes starts with `E_`, for example: `E_MISSING_CONFIG`.

## Available exceptions

```js
const GE = require('@adonisjs/generic-exceptions')

new GE.InvalidArgumentException()
new GE.RuntimeException()
new GE.HttpException()
new GE.LogicalException()
```

## Static methods
For commonly thrown exceptions, AdonisJs provides you a handful of static methods, so that you don't have to remember the `error codes` for those exceptions.

#### missingParamter(method, parameterName, position)
```js
const { InvalidArgumentException } = require('@adonisjs/generic-exceptions')

throw InvalidArgumentException.missingParameter('model.create', 'payload', '1st')
```

Output

```
// Missing parameter payload expected by model.create method as 1st parameter
```

As you can see it returns a properly formatted error message by using the input values. This way we can keep all the exception messages to have same language.

#### invalidParameter(errorMessage, [originalValue])
```js
throw InvalidArgumentException.invalidParameter('username must be a string', originalValue)
```

Output

```
// username must be a string instead received null
```

#### missingConfig(key, file)
Thrown when value for a given key inside configuration file is missing.

```js
const { RuntimeException } = require('@adonisjs/generic-exceptions')

throw RuntimeException.missingConfig('mysql', 'config/database.js')
```

Output
```
mysql is not defined inside config/database.js file
```

#### missingAppKey(providerName)
Thrown when value for `appKey` is not defined.
```js
throw RuntimeException.missingAppKey('Redis')
```

Output
```
Make sure to define appKey inside config/app.js file before using Redis provider
```

#### incompleteConfig(missingKeys, file)
Raised when config file and value exists, but is not complete.

```js
const { RuntimeException } = require('@adonisjs/generic-exceptions')

throw RuntimeException.incompleteConfig(['mysql.username', 'mysql.database'], 'config/database.js')
```

Output
```
Make sure to define mysql.username, mysql.database inside config/database.js file.
```


#### invoke(message, status, [code])
Same as creating a new instance, but the default error `code` is used automatically.

```js
throw InvalidArgumentException.invoke('Custom message', 500)
throw RuntimeException.invoke('Custom message', 500)
```
