# InputWrapper

The `<InputWrapper>` component decorates `<input>`, `<textareaa>`, and
`<select>` elements with validation properties and configuration.

```html
<InputWrapper validators={[fn]}>
  <input type="text" name="foo" />
</InputWrapper>
```


## Properties

All props are documented in [standard component props](./README.md#standard-component-props).


### `<InputWrapper validators={[Function...]}>`

An array of validation functions. Validators are simple functions which
take a string value as input and return a string **only if the value is
invalid**.

This would be a simple required field validator:

```js
function required(value) {
  if (value.trim().length === 0) {
    // Return the validation message...
    return 'This field is required';
  }
  // ...or nothing is value is not empty.
}
```

```html
<InputWrapper validator={[required]}>
  <input type="text" name="foo" />
</InputWrapper>
```


### `<InputWrapper validateOnChange={Boolean:true}>`

Validator functions are executed (after a delay) when the field’s
value changes. To prevent this, set `validateOnChange={false}`.

Default value is inherited from `<FromWrapper>`.


### `<InputWrapper validateOnChangeDelay={Number:500}>`

The number of milliseconds after the field's value changes to wait until
executing validator functions.

Default value is inherited from `<FromWrapper>`.


### `<InputWrapper validateOnBlur={Boolean:true}>`

Each field’s validator functions are executed when the field’s "blur"
event fires. To prevent this, set `validateOnBlur={false}`. This does not
apply to radio inputs.

Default value is inherited from `<FromWrapper>`.


### `<InputWrapper onValidationChange={Function}>`

The function to call when the validation state changes on the wrapped
field. This is useful to trigger component state changes and thus display
validation messages to the user.

Default value is inherited from `<FromWrapper>`.
