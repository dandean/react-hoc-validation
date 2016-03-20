# FormValidationManager

`FormValidationManager` is the central point of coordination between the
components in this module. When fields become valid or invalid,
`FormValidationManager` knows about it, and can give you validation messages
associated with invalid fields in a form.

```js
class Foo extends Component {
  componentWillMount() {
    this.manager = new FormValidationManager();
  }

  render() {
    return (
      <FormWrapper manager={this.manager}>
        ...
      </FormWrapper>
    );
  }
}
```


## Methods


### `getState([fieldName]) -> Boolean | null`

Get the current validation state for the field `name="fieldName"`. Returns
`true`, `false`, or `null`.

If `fieldName` is not given, the entire state object is returned.

* `true`: valid
* `false`: invalid
* `null`: not yet validated


### `getMessage(fieldName) -> String | undefined`

Get the current validation message for the field `name="fieldName"`.


### `getIsAnyFieldInvalid() -> Boolean`

If any field is currently invalid.


### `getIsValidating() -> Boolean`

If validation functions are currently executing.


### `validate([callback])`

Called automatically when the form is submitted. Validates registered
fields. The callback is executed when all validators have completed.
