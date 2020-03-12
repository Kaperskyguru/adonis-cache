'use strict'

/*
 * adonis-middleware-base
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const _ = require('lodash')
const GE = require('@adonisjs/generic-exceptions')
const { resolver } = require('@adonisjs/fold')
const haye = require('haye')
const debug = require('debug')('adonis:middlewarebase')
const CoCompose = require('co-compose')

/**
 * Error message when named middleware is not defined
 * but used
 *
 * @method
 * @private
 *
 * @param  {String} name
 *
 * @return {String}
 */
const missingNamedMiddleware = (name) => {
  return `Cannot find any named middleware for {${name}}. Make sure you have registered it inside start/kernel.js file.`
}

/**
 * Error message when middleware is not a function or
 * string
 *
 * @method
 * @private
 *
 * @return {String}
 */
const invalidMiddlewareType = () => {
  return 'Middleware must be a function or reference to an IoC container string.'
}

/**
 * Warning to log when duplicate middleware registeration has been
 * found
 *
 * @method
 * @private
 *
 * @param  {String} type
 * @param  {String} middleware
 *
 * @return {String}
 */
const duplicateMiddlewareWarning = (type, middleware) => {
  return `Detected existing ${type} middleware {${middleware}}, the current one will be ignored`
}

/**
 * MiddlewareBase class is a simple abstraction written to
 * work just with AdonisJs middleware layer.
 *
 * Adonis has global, named and server middleware with a slight
 * difference in each. So this class understands all and offers
 * a simple abstraction around them.
 *
 * @class MiddlewareBase
 *
 * @param {String}   middlewareFn The function to be called on middleware class
 * @param {Function} [warnFn]
 */
class MiddlewareBase {
  constructor (middlewareFn, warnFn) {
    if (typeof (middlewareFn) !== 'string' || !middlewareFn) {
      throw GE
        .InvalidArgumentException
        .invoke('make sure to define the middleware fn. Report issue to package author', 500)
    }

    this._middleware = {
      global: [],
      server: [],
      named: {},
      handle: middlewareFn
    }

    this._warnFn = typeof (warnFn) === 'function' ? warnFn : function () {}
  }

  /**
   * Throws an exception when middleware is not a function or a raw
   * string.
   *
   * @method _ensureRightMiddlewareType
   *
   * @param  {String|Function}                   middleware
   *
   * @return {void}
   *
   * @throws {RuntimeException} If middleware is not a string or a function
   *
   * @private
   */
  _ensureRightMiddlewareType (middleware) {
    if (typeof (middleware) !== 'string' && typeof (middleware) !== 'function') {
      throw GE.RuntimeException.invoke(invalidMiddlewareType(), 500, 'E_INVALID_MIDDLEWARE_TYPE')
    }
  }

  /**
   * Takes middleware as a function or string and returns an object, that
   * can be used at runtime to resolve and run middleware
   *
   * @method _middlewareIdentifierToPacket
   *
   * @param  {String|Function}                      item
   *
   * @return {Object}
   *
   * @private
   */
  _middlewareIdentifierToPacket (item) {
    return {
      namespace: typeof (item) === 'function' ? item : `${item}.${this._middleware.handle}`,
      params: []
    }
  }

  /**
   * Registers an array of middleware for `server` or `global`
   * type.
   *
   * @method _registerMiddleware
   *
   * @param  {String}            type
   * @param  {Array}             middleware
   * @param  {String}            errorMessage
   *
   * @return {void}
   *
   * @private
   */
  _registerMiddleware (type, middleware, errorMessage) {
    if (!Array.isArray(middleware)) {
      throw GE.InvalidArgumentException.invalidParameter(errorMessage, middleware)
    }

    const store = this._middleware[type]

    middleware.forEach((item) => {
      /**
       * Throw exception if middleware is not a string or a function
       */
      this._ensureRightMiddlewareType(item)

      /**
       * Converting middleware identifier { function, string } to an object, which can be
       * used directly to execute middleware.
       */
      const packet = this._middlewareIdentifierToPacket(item)

      /**
       * Show warning for duplicate middleware
       */
      if (store.find((i) => i.namespace === packet.namespace)) {
        this._warnFn(duplicateMiddlewareWarning(type, item))
        return
      }

      store.push(packet)
    })
  }

  /**
   * Invoked at runtime under the middleware chain. This method will
   * resolve the middleware namespace from the IoC container
   * and invokes it.
   *
   * @method _resolveMiddleware
   *
   * @param  {String|Function} middleware
   * @param  {Array}           options
   *
   * @return {Promise}
   *
   * @private
   */
  _resolveMiddleware (middleware, options) {
    const handlerInstance = resolver.resolveFunc(middleware.namespace)
    const args = options.concat([middleware.params])
    return handlerInstance.method(...args)
  }

  /**
   * Compiles an array of named middleware by getting their namespace from
   * the named hash.
   *
   * @method _compileNamedMiddleware
   *
   * @param  {Array}                namedMiddleware
   *
   * @return {Array}
   *
   * @private
   */
  _compileNamedMiddleware (namedMiddleware) {
    return namedMiddleware.map((middleware) => {
      this._ensureRightMiddlewareType(middleware)

      if (typeof (middleware) === 'function') {
        return {
          namespace: middleware,
          params: []
        }
      }

      const [{ name, args }] = haye.fromPipe(middleware).toArray()
      const packet = this._middleware.named[name]

      if (!packet) {
        throw GE.RuntimeException.invoke(missingNamedMiddleware(name), 500, 'E_MISSING_NAMED_MIDDLEWARE')
      }

      return {
        namespace: packet.namespace,
        params: args
      }
    })
  }

  /**
   * Register global middleware
   *
   * @method registerGlobal
   *
   * @param  {Array}       middleware
   *
   * @return {void}
   *
   * @throws {InvalidArgumentException} If middleware is not an array
   *
   * @example
   * ```js
   * middleware.registerGlobal([
   *   'Adonis/Middleware/BodyParser',
   *   'Adonis/Middleware/Session'
   * ])
   * ```
   */
  registerGlobal (middleware) {
    this._registerMiddleware('global', middleware, 'registerGlobal method accepts an array of middleware')
  }

  /**
   * Register server type middleware
   *
   * @method use
   *
   * @param  {Array} middleware
   *
   * @return {void}
   *
   * @throws {InvalidArgumentException} If middleware is not an array
   *
   * @example
   * ```js
   * middleware.use(['Adonis/Middleware/Static'])
   * ```
   */
  use (middleware) {
    this._registerMiddleware('server', middleware, 'use method accepts an array of middleware')
  }

  /**
   * Register an object of named middleware
   *
   * @method registerNamed
   *
   * @param  {Object}      middleware
   *
   * @return {void}
   *
   * @throws {InvalidArgumentException} If middleware is not an object with key/value pair.
   *
   * @example
   * ```js
   * middleware.registerNamed({
   *   auth: 'Adonis/Middleware/Auth'
   * })
   * ```
   */
  registerNamed (middleware) {
    if (!_.isPlainObject(middleware)) {
      throw GE
        .InvalidArgumentException
        .invalidParameter('server.registerNamed accepts a key/value pair of middleware', middleware)
    }

    _.each(middleware, (item, name) => {
      /**
       * Throw exception if middleware is not a string or a function
       */
      this._ensureRightMiddlewareType(item)

      /**
       * Converting middleware identifier { function, string } to an object, which can be
       * used directly to execute middleware.
       */
      this._middleware.named[name] = this._middlewareIdentifierToPacket(item)
    })
  }

  /**
   * Composes server level middleware
   *
   * @method composeServer
   *
   * @return {Runner}
   */
  composeServer () {
    debug('executing %d server middleware', this._middleware.server)

    return new CoCompose()
      .register(this._middleware.server)
      .runner()
      .resolve(this._resolveMiddleware.bind(this))
  }

  /**
   * Composes global and named middleware together. Pass empty
   * array when no named middleware are supposed to be
   * executed.
   *
   * @method composeGlobalAndNamed
   *
   * @param  {Array}              namedReference
   *
   * @return {Runner}
   */
  composeGlobalAndNamed (namedReference) {
    const middleware = this._middleware.global.concat(this._compileNamedMiddleware(namedReference))
    debug('executing %d global and named middleware', middleware.length)

    return new CoCompose()
      .register(middleware)
      .runner()
      .resolve(this._resolveMiddleware.bind(this))
  }
}

module.exports = MiddlewareBase
