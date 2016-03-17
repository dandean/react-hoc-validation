import validator from 'validator';
import invariant from 'invariant';

/**
 * # Validators
 *
 * Validators are simple functions which take value input and return a string:
 *
 * ```
 * validator(value: String) -> String
 * ```
 */

/**
 * Create a required value validator
 *
 * @param {String} [message] The validation message
 * @return {Function} The validator function
 */
export function createRequired(message='Required') {
  return function required(value, callback) {
    const valid = validator.isNull(value) === false;
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * Create a min-length value validator
 *
 * @throws {Invariant} If length is not a number
 * @throws {Invariant} If length less than 0
 * @param {Number} length The minimum length
 * @param {String} [message] The validation message
 * @return {Function} The validator function
 */
export function createMinLength(length, message='Too short') {
  invariant(Number.isFinite(length), 'Argument `length` must be a number');
  invariant(length >= 0, 'Argument `length` must be at least zero');

  return function minLength(value, callback) {
    const valid = validator.isLength(value, { min: length });
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * Create a max-length value validator
 *
 * @param {Number} length The maximum length
 * @param {String} [message] The validation message
 * @return {Function} The validator function
 */
export function createMaxLength(length, message='Too long') {
  invariant(Number.isFinite(length), 'Argument `length` must be a number');
  invariant(length >= 1, 'Argument `length` must be at least one');

  return function maxLength(value, callback) {
    const valid = validator.isLength(value, { max: length });
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * Create an integer validator
 *
 * @param {String} [message] The validation message
 * @return {Function} The validator function
 */
export function createIsInt(message='Not an integer') {
  return function isInt(value, callback) {
    const valid = validator.isInt(value);
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * Create an phone number validator
 *
 * See validator.js for locale options:
 * https://github.com/chriso/validator.js
 *
 * @param {String} [locale] The locale to enforce
 * @param {String} [message] The validation message
 * @return {Function} The validator function
 */
export function createIsPhone(locale='en-US', message='Not a phone number') {
  return function isPhone(value, callback) {
    const valid = validator.isMobilePhone(value, locale);
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * Create an email validator
 *
 * See validator.js for locale options:
 * https://github.com/chriso/validator.js
 *
 * @param {Object} options Configuration options
 * @param {String} [message] The validation message
 * @return {Function} The validator function
 */
export function createIsEmail(options, message='Invalid email address') {
  return function isEmail(value, callback) {
    const valid = validator.isEmail(value, options);
    const response = valid ? null : message ;
    callback(response);
  }
}

/**
 * Create a regular expression validator
 * @param {RegExp} pattern The regular expression
 * @param {String} [message] The validation message
 * @return {Function} The validator function
 */
export function createMatches(pattern, message='Does not match pattern') {
  return function matches(value, callback) {
    const valid = validator.matches(pattern);
    const response = valid ? null : message ;
    callback(response);
  }
}
