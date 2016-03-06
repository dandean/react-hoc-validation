import validator from 'validator';

export function createRequired(message='Required') {
  return required(value, callback) {
    const valid = validator.isNull(value) === false;
    const message = valid ? null : message ;
    callback(message);
  }
}

export function createMinLength(length, message='Too short') {
  return minLength(value, callback) {
    const valid = validator.isLength(value, { min: length });
    const result = valid ? null : message ;
    callback(message);
  }
}

export function createMaxLength(length, message='Too long') {
  return maxLength(value, callback) {
    const valid = validator.isLength(value, { max: length });
    const result = valid ? null : message ;
    callback(message);
  }
}

export function createIsInt(message='Not an integer') {
  return isInt(value, callback) {
    const valid = validator.isInt(value);
    const result = valid ? null : message ;
    callback(message);
  }
}

export function createIsPhone(locale='en-US', message='Not a phone number') {
  return isPhone(value, callback) {
    const valid = validator.isMobilePhone(value, locale);
    const result = valid ? null : message ;
    callback(message);
  }
}

export function createIsEmail(options, message='Invalid email address') {
  return isEmail(value, callback) {
    const valid = validator.isEmail(value, options);
    const result = valid ? null : message ;
    callback(message);
  }
}

export function createMatches(pattern, message='Does not match pattern') {
  return matches(value, callback) {
    const valid = validator.matches(pattern);
    const result = valid ? null : message ;
    callback(message);
  }
}
