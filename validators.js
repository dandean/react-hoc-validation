'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createRequired = createRequired;
exports.createMinLength = createMinLength;
exports.createMaxLength = createMaxLength;
exports.createIsInt = createIsInt;
exports.createIsPhone = createIsPhone;
exports.createIsEmail = createIsEmail;
exports.createMatches = createMatches;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _validatorLibIsNull = require('validator/lib/isNull');

var _validatorLibIsNull2 = _interopRequireDefault(_validatorLibIsNull);

var _validatorLibIsLength = require('validator/lib/isLength');

var _validatorLibIsLength2 = _interopRequireDefault(_validatorLibIsLength);

var _validatorLibIsInt = require('validator/lib/isInt');

var _validatorLibIsInt2 = _interopRequireDefault(_validatorLibIsInt);

var _validatorLibIsMobilePhone = require('validator/lib/isMobilePhone');

var _validatorLibIsMobilePhone2 = _interopRequireDefault(_validatorLibIsMobilePhone);

var _validatorLibIsEmail = require('validator/lib/isEmail');

var _validatorLibIsEmail2 = _interopRequireDefault(_validatorLibIsEmail);

var _validatorLibMatches = require('validator/lib/matches');

var _validatorLibMatches2 = _interopRequireDefault(_validatorLibMatches);

/**
 * # Validators
 *
 * Validators are simple functions which take value input and a callback. The
 * callback is given a string when input is invalid.
 *
 * ```
 * validator(value: String, callback: Function)
 * ```
 *
 * Here's an example of a simple required-field validator:
 *
 * ```js
 * function required(value, callback) {
 *   const valid = value.trim().length > 0;
 *   const message = valid ? null : 'This is a required field' ;
 *   callback(message);
 * }
 * ```
 *
 *
 * ## Validator configuration: creators
 *
 * Because validators are simple functions which take only a field’s value as
 * input there is no way to pass custom validation messages or other
 * configuration options into a validator as arguments.
 *
 * JavaScript has a solution built in to support this in a different way:
 * **closures**.
 *
 *
 * ### Custom validation messages
 *
 * Here's an example of a required-field validator **creator** which enables a
 * a custom validation message:
 *
 * ```js
 * function createRequired(message='This is a required field') {
 *   return function required(value, callback) {
 *     const valid = value.trim().length > 0;
 *     const response = valid ? null : message ;
 *     callback(response);
 *   }
 * }
 *
 * const requiredEmail = createRequired('Please enter an email address');
 * const requiredPassphrase = createRequired('Please enter an passphrase');
 * ```
 *
 *
 * ### Validator options
 *
 * Closures also allow for creating validators with parameters:
 *
 * ```js
 * export function createMinLength(length, message='Too short') {
 *   return function minLength(value, callback) {
 *     const valid = value.length >= length;
 *     const response = valid ? null : message ;
 *     callback(response);
 *   }
 * }
 *
 * const minLengthFive = createMinLength(5);
 * const minLengthTen = createMinLength(10, 'Usernames must be at least 10 characters long');
 * ```
 *
 *
 * ## Learn More
 *
 * Read the source for good examples of how to create your own validators and
 * validator creators: [src/validators.js](../src/validators.js).
 *
 *
 * ## Provided Validator Creators
 *
 * A few validator creators are provided by this module. For the most part you
 * should create your own, I suggest using
 * [Chris O’Hara’s validator.js](https://www.npmjs.com/package/validator) as the
 * foundation for your own validators.
 */

/**
 * #### `createRequired(message='Required')`
 *
 * Creates a required value validator
 */

function createRequired() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'Required' : arguments[0];

  return function required(value, callback) {
    var valid = (0, _validatorLibIsNull2['default'])(value) === false;
    var response = valid ? null : message;
    callback(response);
  };
}

/**
 * #### `createMinLength(length: Number, message='Too short')`
 *
 * Creates a min-length value validator. Throws `invariant` if `length` is not a
 * Number or is less than zero.
 */

function createMinLength(length) {
  var message = arguments.length <= 1 || arguments[1] === undefined ? 'Too short' : arguments[1];

  (0, _invariant2['default'])(Number.isInteger(length), 'Argument `length` must be an integer');
  (0, _invariant2['default'])(length >= 0, 'Argument `length` must be at least zero');

  return function minLength(value, callback) {
    var valid = !value || (0, _validatorLibIsLength2['default'])(value, { min: length });
    var response = valid ? null : message;
    callback(response);
  };
}

/**
 * #### `createMaxLength(length: Number, message='Too long')`
 *
 * Creates a max-length value validator. Throws `invariant` if `length` is not a
 * Number or is less than one.
 */

function createMaxLength(length) {
  var message = arguments.length <= 1 || arguments[1] === undefined ? 'Too long' : arguments[1];

  (0, _invariant2['default'])(Number.isInteger(length), 'Argument `length` must be a number');
  (0, _invariant2['default'])(length >= 1, 'Argument `length` must be at least one');

  return function maxLength(value, callback) {
    var valid = !value || (0, _validatorLibIsLength2['default'])(value, { max: length });
    var response = valid ? null : message;
    callback(response);
  };
}

/**
 * #### `createIsInt(message='Not an integer')`
 *
 * Creates an integer string validator
 */

function createIsInt() {
  var message = arguments.length <= 0 || arguments[0] === undefined ? 'Not an integer' : arguments[0];

  return function isInt(value, callback) {
    var valid = !value || isInt(value);
    var response = valid ? null : message;
    callback(response);
  };
}

/**
 * #### `createIsPhone(locale='en-US', message='Not a phone number')`
 *
 * Create a phone number validator
 *
 * See validator.js for locale options:
 * https://github.com/chriso/validator.js
 */

function createIsPhone() {
  var locale = arguments.length <= 0 || arguments[0] === undefined ? 'en-US' : arguments[0];
  var message = arguments.length <= 1 || arguments[1] === undefined ? 'Not a phone number' : arguments[1];

  return function isPhone(value, callback) {
    var valid = !value || (0, _validatorLibIsMobilePhone2['default'])(value, locale);
    var response = valid ? null : message;
    callback(response);
  };
}

/**
 * #### `createIsEmail(options, message='Invalid email address')`
 *
 * Create an email validator
 *
 * See validator.js for email validation options:
 * https://github.com/chriso/validator.js
 */

function createIsEmail(options) {
  var message = arguments.length <= 1 || arguments[1] === undefined ? 'Invalid email address' : arguments[1];

  return function isEmail(value, callback) {
    var valid = !value || isEmail(value, options);
    var response = valid ? null : message;
    callback(response);
  };
}

/**
 * #### `createMatches(pattern: RegExp, message='Does not match pattern /pattern/)`
 *
 * Create a regular expression validator
 */

function createMatches(pattern) {
  var message = arguments.length <= 1 || arguments[1] === undefined ? 'Does not match pattern `' + pattern + '`' : arguments[1];
  return (function () {
    (0, _invariant2['default'])(pattern instanceof RegExp, 'Argument `pattern` must be a regular expression');

    return function matches(value, callback) {
      var valid = !value || matches(value, pattern);
      var response = valid ? null : message;
      callback(response);
    };
  })();
}
