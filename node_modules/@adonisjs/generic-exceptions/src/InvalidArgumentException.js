'use strict'

/*
 * adonis-generic-exceptions
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const upcast = require('upcast')
const NE = require('node-exceptions')

/**
 * Invalid argument exception is thrown when methods or functions
 * arguments are missing or wrong.
 *
 * @class InvalidArgumentException
 */
class InvalidArgumentException extends NE.InvalidArgumentException {
  static get repo () {
    return 'adonisjs/errors'
  }

  /**
   * Throw an exception when there is a missing parameter
   *
   * @method missingParameter
   * @static
   *
   * @param  {String}         method
   * @param  {String}         parameterName
   * @param  {String|Number}  position
   *
   * @return {InvalidArgumentException}
   */
  static missingParameter (method, parameterName, position) {
    const message = `Missing parameter ${parameterName} expected by ${method} method as ${position} parameter`
    return new this(message, 500, 'E_MISSING_PARAMETER', this.repo)
  }

  /**
   * Throw exception when the parameter received is invalid
   *
   * @method invalidParameter
   * @static
   *
   * @param  {String}         errorMessage
   * @param  {Mixed}          originalValue
   *
   * @return {InvalidArgumentException}
   */
  static invalidParameter (errorMessage, originalValue) {
    const message = originalValue !== undefined
    ? `${errorMessage} instead received ${upcast.type(originalValue)}`
    : errorMessage

    return new this(message, 500, 'E_INVALID_PARAMETER', this.repo)
  }

  /**
   * Invoke instance of this class with a custom message
   * status and error code
   *
   * @method invoke
   *
   * @param  {String} message
   * @param  {Number} [status = 500]
   * @param  {String} [code = E_INVALID_ARGUMENT]
   *
   * @return {InvalidArgumentException}
   */
  static invoke (message, status = 500, code = 'E_INVALID_ARGUMENT') {
    return new this(message, status, code, this.repo)
  }
}

module.exports = InvalidArgumentException
