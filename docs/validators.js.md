# Validators

Validators are simple functions which take value input and a callback. The
callback is given a string when input is invalid.

```
validator(value: String, callback: Function)
```

Here's an example of a simple required-field validator:

```js
function required(value, callback) {
  const valid = value.trim().length > 0;
  const message = valid ? null : 'This is a required field' ;
  callback(message);
}
```


## Validator configuration: creators

Because validators are simple functions which take only a field’s value as
input there is no way to pass things custom validation messages or other
configuratio options into a validator as arguments.

JavaScript has a solution built in to support this in a different way:
**closures**.


### Custom validation messages

Here's an example of a required-field validator *creator*, which allows for
a custom validation message:

```js
function createRequired(message='This is a required field') {
  return function required(value, callback) {
    const valid = value.trim().length > 0;
    const response = valid ? null : message ;
    callback(response);
  }
}

const requiredEmail = createRequired('Please enter an email address');
const requiredPassphrase = createRequired('Please enter an passphrase');
```


### Validator options

Closures also allow for creating validators with parameters:

```js
export function createMinLength(length, message='Too short') {
  return function minLength(value, callback) {
    const valid = value.length >= length;
    const response = valid ? null : message ;
    callback(response);
  }
}

const minLengthFive = createMinLength(5);
const minLengthTen = createMinLength(10, 'Usernames must be at least 10 characters long');
```


## Learn More

Read the source for good examples of how to create your own validators and
validator creators: [src/validators.js](../src/validators.js).


## Provided Validator Creators

A few validator creators are provided by this module. For the most part you
should create your own, I suggest using [validator.js](https://www.npmjs.com/package/validator)
as the foundation for your own validator creators.


#### `createRequired(message='Required')`

Creates a required value validator


#### `createMinLength(length: Number, message='Too short')`

Creates a min-length value validator. Throws `invariant` if `length` is not a
Number or is less than zero.


#### `createMaxLength(length: Number, message='Too long')`

Creates a max-length value validator. Throws `invariant` if `length` is not a
Number or is less than one.


#### `createIsInt(message='Not an integer')`

Creates an integer string validator


#### `createIsPhone(locale='en-US', message='Not a phone number')`

Create a phone number validator

See validator.js for locale options:
https://github.com/chriso/validator.js


#### `createIsEmail(options, message='Invalid email address')`

Create an email validator

See validator.js for email validation options:
https://github.com/chriso/validator.js


#### `createMatches(pattern: RegExp, message='Does not match pattern /pattern/)`

Create a regular expression validator
