# Documentation

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

Validator functions are just basic functions which receive the the field’s input
and return a message string if the input is invalid.

Here's an example required value validator:

```js
function required(value) {
  if (value.trim().length === 0) {
    // Return the validation message...
    return 'This field is required';
  }
  // ...or nothing is value is not empty.
}

```

And a component which uses it:

```html
<InputWrapper validator={[required]}>
  <input type="text" name="foo" />
</InputWrapper>
```

## Component and Classes

* [`<FormWrapper>`](./form-wrapper.js.md)
* [`<InputWrapper>`](./input-wrapper.js.md)
