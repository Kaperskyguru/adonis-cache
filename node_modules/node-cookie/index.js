'use strict'

/*
 * node-cookie
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const parser = require('cookie')
const signature = require('cookie-signature')
const simpleEncryptor = require('simple-encryptor')

const encrypters = {}

/**
 * Returns an encrypter instance to be used for
 * encrypting the cookie. Since creating a new
 * instance each time is expensive, we cache
 * the instances based on secret and it is
 * less likely that someone will use a different
 * secret for each HTTP request.
 *
 * @method getEncrypter
 *
 * @param  {String}     secret
 *
 * @return {Object}
 *
 * @private
 */
const getEncrypter = function (secret) {
  if (!encrypters[secret]) {
    encrypters[secret] = simpleEncryptor({
      key: secret,
      hmac: false
    })
  }
  return encrypters[secret]
}

/**
 * Cookie parser is a simple utility module to read
 * and write cookies on Node.js HTTP requests.
 * It supports cookie signing and encryption.
 *
 * @module Cookie
 */
let Cookie = exports = module.exports = {}

/**
 * Parses cookie value from a JSON marked string into
 * a JSON object or returns the actual value when
 * value is not marked as JSON string.
 *
 * @method _parseJSON
 *
 * @param  {String}   value
 *
 * @return {String|Object|Null}
 *
 * @private
 */
Cookie._parseJSON = function (value) {
  if (typeof (value) === 'string' && value.substr(0, 2) !== 'j:') {
    return value
  }

  try {
    return JSON.parse(value.slice(2))
  } catch (err) {
    return null
  }
}

/**
 * Marks a cookie as a JSON string when the value of
 * cookie is an object.
 *
 * @method _stringifyJSON
 *
 * @param  {Mixed}      value
 *
 * @return {String}
 *
 * @private
 */
Cookie._stringifyJSON = function (value) {
  return typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)
}

/**
 * Signs the cookie value when signature exists.
 *
 * @method _signValue
 *
 * @param  {String}   value
 * @param  {String}   [secret = null]
 *
 * @return {String}
 *
 * @private
 */
Cookie._signValue = function (value, secret = null) {
  if (!secret) {
    return value
  }
  return `s:${signature.sign(value, secret)}`
}

/**
 * Unsigns the cookie value when value is signed
 * and secret exists.
 *
 * @method _unSignValue
 *
 * @param  {String}     value
 * @param  {String}     secret
 *
 * @return {String}
 *
 * @private
 */
Cookie._unSignValue = function (value, secret = null) {
  value = String(value)

  /**
   * Value is not signed, return as it is.
   */
  if (value.substr(0, 2) !== 's:') {
    return value
  }

  /**
   * Value is signed but secret does not
   * exists, so return null
   */
  if (!secret) {
    return null
  }

  /**
   * Attempt to unsign value with secret
   */
  return signature.unsign(value.slice(2), secret) || null
}

/**
 * Appends values to the cookie header.
 *
 * @method _append
 *
 * @param  {http.ServerResponse} res
 * @param  {String}              cookie
 *
 * @return {void}
 *
 * @private
 */
Cookie._append = function (res, cookie) {
  const cookies = res.getHeader('Set-Cookie') || []
  Array.isArray(cookies) ? cookies.push(cookie) : [cookies].push(cookie)
  res.setHeader('Set-Cookie', cookies.map(String))
}

/**
 * Encrypts a string with AES-256 encryption.
 *
 * @method _encrypt
 *
 * @param  {String} value
 * @param  {String} secret
 *
 * @return {String}
 *
 * @private
 */
Cookie._encrypt = function (value, secret) {
  return getEncrypter(secret).encrypt(value)
}

/**
 * Decrypts the encrypted value. Make sure the secret
 * is same when decrypting values
 *
 * @method _decrypt
 *
 * @param  {String} value
 * @param  {String} secret
 *
 * @return {String}
 *
 * @private
 */
Cookie._decrypt = function (value, secret) {
  return getEncrypter(secret).decrypt(value)
}

/**
 * Returns an object of cookies. If cookie header
 * has no value, it will return an empty object.
 *
 * @method _parseCookies
 *
 * @param  {http.IncomingRequest}      req
 *
 * @return {Object}
 *
 * @private
 */
Cookie._parseCookies = function (req) {
  const cookieString = req.headers['cookie']
  return cookieString ? parser.parse(cookieString) : {}
}

/**
 * Parses cookies from HTTP header `Cookie` into
 * a javascript object. Also it will unsign
 * and decrypt cookies encrypted and signed
 * by this library using a secret.
 *
 * @method parse
 *
 * @param  {http.IncomingRequest}      req
 * @param  {String}                    [secret = null]
 * @param  {Boolean}                   [decrypt = false]
 *
 * @return {Object}
 *
 * @example
 * ```js
 * nodeCookie.parse(req)
 *
 * // or if cookies were signed when writing
 * nodeCookie.parse(req, 'SECRET')
 *
 * // also if cookies were encrypted
 * nodeCookie.parse(req, 'SECRET', true)
 * ```
 */
Cookie.parse = function (req, secret = null, decrypt = false) {
  /**
   * We need to parse cookies by unsign them, if secret
   * is defined and also converting JSON marked string
   * into a valid javascript object.
   *
   * @type {Object}
   */
  const parsedCookies = {}

  const cookies = Cookie._parseCookies(req)

  Object.keys(cookies).forEach((key) => {
    parsedCookies[key] = Cookie.get(req, key, secret, decrypt, cookies)
  })

  return parsedCookies
}

/**
 * Returns value for a single cookie by its key. It is
 * recommended to make use of this function when you
 * want to pull a single cookie. Since the `parse`
 * method will eagerly unsign and decrypt all the
 * cookies.
 *
 * @method get
 *
 * @param  {http.IncomingRequest}      req
 * @param  {String}                    key
 * @param  {String}                    [secret = null]
 * @param  {Boolean}                   [decrypt = false]
 * @param  {Object}                    [cookies = null] Use existing cookies object over re-parsing them from the header.
 *
 * @return {Mixed}
 *
 * @example
 * ```js
 * nodeCookie.get(req, 'sessionId')
 *
 * // if cookie was signed
 * nodeCookie.get(req, 'sessionId', 'SECRET')
 *
 * // if cookie was encrypted
 * nodeCookie.get(req, 'sessionId', 'SECRET', true)
 * ```
 */
Cookie.get = function (req, key, secret = null, decrypt = false, cookies = null) {
  cookies = cookies || Cookie._parseCookies(req)
  let cookie = cookies[key]

  /**
   * Return null when cookie value does not
   * exists for a given key
   */
  if (!cookie) {
    return null
  }

  return this.unPackValue(cookie, secret, decrypt)
}

/**
 * Unpack cookie value by unsigning and decrypting
 * it. Infact you can unpack any value packed via
 * the `packValue` method.
 *
 * @method unPackValue
 *
 * @param  {String}    value
 * @param  {String}    secret
 * @param  {Boolean}   decrypt
 *
 * @return {String}
 */
Cookie.unPackValue = function (value, secret, decrypt) {
  /**
   * Decrypt value when cookie secret is defined
   * and decrypt is set to true.
   */
  if (secret && decrypt) {
    value = Cookie._decrypt(value, secret)
  }

  value = value ? Cookie._unSignValue(value, secret) : null
  return value ? Cookie._parseJSON(value) : null
}

/**
 * Pack the value by properly formatting,
 * signing and encrypting it.
 *
 * @method packValue
 *
 * @param  {String}   value
 * @param  {String}   [secret = null]
 * @param  {Boolean}  [encrypt = false]
 *
 * @return {String}
 */
Cookie.packValue = function (value, secret, encrypt) {
  value = Cookie._stringifyJSON(value)
  value = Cookie._signValue(value, secret)

  /**
   * Encrypt the cookie value only when secret is defined
   * and encrypt is set to true
   */
  if (secret && encrypt) {
    value = Cookie._encrypt(value, secret)
  }

  return String(value)
}

/**
 * Write cookie to the HTTP response object. It will append
 * duplicate cookies to the `Set-Cookie` header, since
 * browsers discard the duplicate cookies by themselves
 *
 * @method create
 *
 * @param  {http.ServerResponse}      res
 * @param  {String}                   key
 * @param  {*}                        value
 * @param  {Object}                   [options = {}]
 * @param  {String}                   [secret = null]
 * @param  {Boolean}                  [encrypt = false]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeCookie.create(res, 'sessionId', 1)
 *
 * // sign session id
 * nodeCookie.create(res, 'sessionId', 1, {}, 'SECRET')
 *
 * // sign and encrypt session id
 * nodeCookie.create(res, 'sessionId', 1, {}, 'SECRET', true)
 * ```
 */
Cookie.create = function (res, key, value, options = {}, secret = null, encrypt = false) {
  const cookie = parser.serialize(key, Cookie.packValue(value, secret, encrypt), options)
  Cookie._append(res, cookie)
}

/**
 * Clears the cookie from browser by setting it's expiry
 * in past. This is required since there is no other
 * way to instruct the browser to delete a cookie.
 *
 * Also this method will override the `expires` value on
 * the options object.
 *
 * @method clear
 *
 * @param  {http.ServerResponse}      res
 * @param  {String} key
 * @param  {Object} [options = {}]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeCookie.clear(res, 'sessionId')
 * ```
 */
Cookie.clear = function (res, key, options = {}) {
  options.expires = new Date(1)
  Cookie.create(res, key, '', options)
}
