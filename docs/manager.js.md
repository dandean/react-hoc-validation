# FormManager

`FormManager` is the central point of coordination between the various
components in this tool.


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

Validates every registered field. Callback is called once all validators
have completed. `validate()` is called automatically when the form is
submitted.
