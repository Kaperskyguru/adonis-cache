'use strict'

/*
 * adonis-generic-exceptions
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const GE = require('.')

test('exported modules should be instantiable', (assert) => {
  const invalidArgumentException = new GE.InvalidArgumentException()
  const runtimeException = new GE.RuntimeException()
  const httpException = new GE.HttpException()
  const logicalException = new GE.LogicalException()

  assert.instanceOf(invalidArgumentException, GE.InvalidArgumentException)
  assert.instanceOf(runtimeException, GE.RuntimeException)
  assert.instanceOf(httpException, GE.HttpException)
  assert.instanceOf(logicalException, GE.LogicalException)
})

test('each exception should link to errors repo', (assert) => {
  assert.equal(
    GE.InvalidArgumentException.missingParameter('lucid', 'username', '2nd').message,
    'E_MISSING_PARAMETER: Missing parameter username expected by lucid method as 2nd parameter\n> More details: https://err.sh/adonisjs/errors/E_MISSING_PARAMETER'
  )

  assert.equal(
    GE.InvalidArgumentException.invalidParameter('username').message,
    'E_INVALID_PARAMETER: username\n> More details: https://err.sh/adonisjs/errors/E_INVALID_PARAMETER'
  )

  assert.equal(
    GE.RuntimeException.missingConfig('connection', 'database').message,
    'E_MISSING_CONFIG: connection is not defined inside database file\n> More details: https://err.sh/adonisjs/errors/E_MISSING_CONFIG'
  )

  assert.equal(
    GE.RuntimeException.missingAppKey('Route').message,
    'E_MISSING_APP_KEY: Make sure to define appKey inside config/app.js file before using Route provider\n> More details: https://err.sh/adonisjs/errors/E_MISSING_APP_KEY'
  )

  assert.equal(
    GE.RuntimeException.missingEnvKey('FOO').message,
    'E_MISSING_ENV_KEY: Make sure to define environment variable FOO.\n> More details: https://err.sh/adonisjs/errors/E_MISSING_ENV_KEY'
  )

  assert.equal(
    GE.RuntimeException.incompleteConfig(['foo'], 'bar').message,
    'E_INCOMPLETE_CONFIG: Make sure to define foo inside bar\n> More details: https://err.sh/adonisjs/errors/E_INCOMPLETE_CONFIG'
  )
})
