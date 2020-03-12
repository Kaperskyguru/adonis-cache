# Require Stack

![](https://img.shields.io/travis/thetutlage/require-stack.svg)

Nodejs require method does not provide filename or line number for syntax errors when requiring modules under try/catch statement.
Ideally it is not the problem with Node Js, it has something to do with v8 itself.

`Require Stack` is a wrapper around `require` method, which makes it easier to get syntax error with proper error stack when wrapping require call under `try/catch` block.

## Using Node Js

```javascript
try{
  require('./module/with/syntax/error')
}catch(e){
  console.log(e.stack)
}
```

above prints

```
SyntaxError: Unexpected token {
    at exports.runInThisContext (vm.js:53:16)
    at Module._compile (module.js:413:25)
    at Object.Module._extensions..js (module.js:452:10)
    at Module.load (module.js:355:32)
    at Function.Module._load (module.js:310:12)
    at Module.require (module.js:365:17)
    at require (module.js:384:17)
    at Object.<anonymous> (/Users/harmindervirk/workspace/personal/active-packages/require-stack/index.js:11:3)
    at Module._compile (module.js:434:26)
    at Object.Module._extensions..js (module.js:452:10)
```

Which is no reference to the filename or linenumber where syntax error has occured. File reference on line number 9 is the file from where code is executed.

## Using require stack 

```
var requireStack = require('require-stack')
try{
  requireStack('./module/with/syntax/error')
}catch(e){
  console.log(e.stack)
}
```

above prints

```
/Users/harmindervirk/workspace/personal/active-packages/require-stack/test/modules/index.js:2
  return {
         ^
ParseError: Unexpected token
```

Which has reference to the filename with exact line number

## Bonus

It does all the hard work required to setup error stack which can be parsed by [https://www.npmjs.com/package/stack-trace](https://www.npmjs.com/package/stack-trace).


![](http://s9.postimg.org/3xg4vpcbz/Screen_Shot_2015_10_09_at_2_27_07_PM.png)