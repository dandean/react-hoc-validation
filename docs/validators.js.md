Prebuilt validator creation functions
@module validators


Create a required value validator

@param {String} [message] The validation message
@return {Function} The validator function


Create a min-length value validator

@throws {Invariant} If length is not a number
@throws {Invariant} If length less than 0
@param {Number} length The minimum length
@param {String} [message] The validation message
@return {Function} The validator function


Create a max-length value validator

@param {Number} length The maximum length
@param {String} [message] The validation message
@return {Function} The validator function


Create an integer validator

@param {String} [message] The validation message
@return {Function} The validator function


Create an phone number validator

See validator.js for locale options:
https://github.com/chriso/validator.js

@param {String} [locale] The locale to enforce
@param {String} [message] The validation message
@return {Function} The validator function


Create an email validator

See validator.js for locale options:
https://github.com/chriso/validator.js

@param {Object} options Configuration options
@param {String} [message] The validation message
@return {Function} The validator function


Create a regular expression validator
@param {RegExp} pattern The regular expression
@param {String} [message] The validation message
@return {Function} The validator function
