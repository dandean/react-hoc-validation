# Documentation

Basic markup taken from one of the examples:

```html
<FormWrapper manager={this.manager} onValidationChange={this.handleValidationChange.bind(this)}>
  <form>
    <label htmlFor="username">Username</label>
    <InputWrapper validators={[required]}>
      <input type="text" name="username" id="username" />
    </InputWrapper>
    <span className={usernameMessageClassName}>
      {this.manager.getFieldValidationMessage('username')}
    </span>
    <input type="submit" value="submit" />
  </form>
</FormWrapper>
```

## Standard Component Props

These components decorate standard HTML elements with validation properties and
configuration. Because these are (for the most part) higher order components,
the rendered DOM element for each *is* the wrapped HTML element.

Configuration defaults are set on `<FormWrapper>` and can be overridden on
individual fields.


### `validateOnChange={Boolean:true}`

Validator functions are executed when a field's value changes. Set
`validateOnChange={false}` to disable this.


### `validateOnChangeDelay={Number:500}`

Validator functions are executed after a delay (in milliseconds). This prevents
over-eager validation UI changes as the user type into the field.


### `validateOnBlur={Boolean:true}`

Validators functions are executed when a field’s "blur" event fires. Set
`validateOnBlur={false}` to disable this. This does not apply to radio inputs.


### `onValidationChange={Function}`

The function to call when the validation state changes. This is useful to
trigger component state changes and thus display validation messages to the user.


## Validator Functions

### `validators={[Function...]}`

Applies only to `<InputWrapper>` and `<RadioGroup>`.

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

And a component which uses it:

```html
<InputWrapper validator={[required]}>
  <input type="text" name="foo" />
</InputWrapper>
```

## Component, Classes, and Validators

* [`<FormWrapper>`](./form-wrapper.js.md)
* [`<InputWrapper>`](./input-wrapper.js.md)
* [`validators`](./validators.js.md)
