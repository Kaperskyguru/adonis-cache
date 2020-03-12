'use strict';

'use strict';

/*
 * resetable
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

var clone = require('clone');

var Resetable = function Resetable (originalValue) {
  this._originalValue = originalValue;
  this.set(clone(originalValue));
};

/**
 * Set the value to whatever
 *
 * @method set
 *
 * @param{Mixed} val
 * @chainable
 */
Resetable.prototype.set = function set (val) {
  this._val = val;
  return this
};

/**
 * Set the value back
 *
 * @method get
 *
 * @return {Mixed}
 */
Resetable.prototype.get = function get () {
  return this._val
};

/**
 * Reset the value back to whatever was the
 * original value
 *
 * @method reset
 */
Resetable.prototype.reset = function reset () {
  this.set(clone(this._originalValue));
};

/**
 * Get the value and reset all in
 * one go
 *
 * @method pull
 *
 * @return {Mixed}
 */
Resetable.prototype.pull = function pull () {
    var this$1 = this;

  return (function (val) {
    this$1.reset();
    return val
  })(this.get())
};

module.exports = Resetable;
