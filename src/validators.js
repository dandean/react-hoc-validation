import invariant from 'invariant';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import isInt from 'validator/lib/isInt';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmail from 'validator/lib/isEmail';
import matches from 'validator/lib/matches';

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
export function createRequired(message='Required') {
  return function required(value, callback) {
    const valid = isEmpty(value) === false;
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * #### `createMinLength(length: Number, message='Too short')`
 *
 * Creates a min-length value validator. Throws `invariant` if `length` is not a
 * Number or is less than zero.
 */
export function createMinLength(length, message='Too short') {
  invariant(Number.isInteger(length), 'Argument `length` must be an integer');
  invariant(length >= 0, 'Argument `length` must be at least zero');

  return function minLength(value, callback) {
    const valid = !value || isLength(value, { min: length });
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * #### `createMaxLength(length: Number, message='Too long')`
 *
 * Creates a max-length value validator. Throws `invariant` if `length` is not a
 * Number or is less than one.
 */
export function createMaxLength(length, message='Too long') {
  invariant(Number.isInteger(length), 'Argument `length` must be a number');
  invariant(length >= 1, 'Argument `length` must be at least one');

  return function maxLength(value, callback) {
    const valid = !value || isLength(value, { max: length });
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * #### `createIsInt(message='Not an integer')`
 *
 * Creates an integer string validator
 */
export function createIsInt(message='Not an integer') {
  return function isInt(value, callback) {
    const valid = !value || isInt(value);
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * #### `createIsPhone(locale='en-US', message='Not a phone number')`
 *
 * Create a phone number validator
 *
 * See validator.js for locale options:
 * https://github.com/chriso/validator.js
 */
export function createIsPhone(locale='en-US', message='Not a phone number') {
  return function isPhone(value, callback) {
    const valid = !value || isMobilePhone(value, locale);
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * #### `createIsEmail(options, message='Invalid email address')`
 *
 * Create an email validator
 *
 * See validator.js for email validation options:
 * https://github.com/chriso/validator.js
 */
export function createIsEmail(options, message='Invalid email address') {
  return function isEmail(value, callback) {
    const valid = !value || isEmail(value, options);
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * #### `createMatches(pattern: RegExp, message='Does not match pattern /pattern/)`
 *
 * Create a regular expression validator
 */
export function createMatches(pattern, message=`Does not match pattern \`${pattern}\``) {
  invariant(pattern instanceof RegExp, 'Argument `pattern` must be a regular expression');

  return function matches(value, callback) {
    const valid = !value || matches(value, pattern);
    const response = valid ? null : message ;
    callback(response);
  }
}
