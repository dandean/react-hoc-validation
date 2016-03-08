import validator from 'validator';

export function createRequired(message='Required') {
  return function required(value, callback) {
    const valid = validator.isNull(value) === false;
    const response = valid ? null : message ;
    callback(response);
  }
}

export function createMinLength(length, message='Too short') {
  return function minLength(value, callback) {
    const valid = validator.isLength(value, { min: length });
    const response = valid ? null : message ;
    callback(response);
  }
}

export function createMaxLength(length, message='Too long') {
  return function maxLength(value, callback) {
    const valid = validator.isLength(value, { max: length });
    const response = valid ? null : message ;
    callback(response);
  }
}

export function createMinLength(length, message='Too short') {
  return function minLength(value, callback) {
    const valid = validator.isLength(value, { min: length });
    const response = valid ? null : message ;
    callback(response);
  }
}

export function createIsInt(message='Not an integer') {
  return function isInt(value, callback) {
    const valid = validator.isInt(value);
    const response = valid ? null : message ;
    callback(response);
  }
}

export function createIsPhone(locale='en-US', message='Not a phone number') {
  return function isPhone(value, callback) {
    const valid = validator.isMobilePhone(value, locale);
    const response = valid ? null : message ;
    callback(response);
  }
}

export function createIsEmail(options, message='Invalid email address') {
  return function isEmail(value, callback) {
    const valid = validator.isEmail(value, options);
    const response = valid ? null : message ;
    callback(response);
  }
}

export function createMatches(pattern, message='Does not match pattern') {
  return function matches(value, callback) {
    const valid = validator.matches(pattern);
    const response = valid ? null : message ;
    callback(response);
  }
}
