'use strict'

/**
 * require-stack
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const path = require('path')

/**
 * @function getRequirePath
 * @description creates a require path to be used by require method
 * while requiring/loading a module
 * @param  {String}       requirePath
 * @return {String}
 * @public
 */
const getRequirePath = function (requirePath) {
  var start = requirePath.substring(0, 2)
  /**
   * finding whether require path is a node module
   * or not.
   */
  if (start !== './' && start !== '..') {
    return requirePath
  }
  return path.join(path.dirname(module.parent.parent.filename), requirePath)
}

/**
 * @function requireStack
 * @description requires a given path using node require
 * method by making sure to catch and rebuild syntax
 * errors
 * @param  {String}     requirePath
 * @return {Module}
 * @public
 */
const requireStack = function requireStack (requirePath) {
  requirePath = getRequirePath(requirePath)

  try {
    return require(requirePath)
  } catch (e) {
    if (e.name !== 'SyntaxError') {
      throw e
    }

    const fs = require('fs')
    const check = require('syntax-error')
    const filePath = require.resolve(requirePath)
    const fileSrc = fs.readFileSync(filePath)
    const errors = check(fileSrc, filePath)
    /**
     * strict mode errors are not parsed by acorn and returns undefined
     * In that, we modify the actual stack trace and re-throw it.
     * Which is better than throwing undefined errors.
     */
    if (!errors) {
      e.stack = `${e.toString()} \n at ${filePath} (${filePath}:1:1)`
      throw e
    }
    const errorsArray = errors.toString().split('\n')
    errors.message = errors.message + ' ' + errorsArray[2]
    const file = filePath + ':' + errors.line + ':' + errors.column
    errors.stack = errors.toString() + '\n at ' + errorsArray[2] + ' (' + file + ')'
    throw errors
  }
}

requireStack.getRequirePath = getRequirePath

/**
 * @module requireStack
 * @description require's a module using node require but
 * reports syntax errors with proper filename and line
 * numbers under try/catch block which are missing
 * by default.
 */
module.exports = requireStack
