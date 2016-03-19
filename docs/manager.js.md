# FormManager

`FormManager` is the central point of coordination between the various
components in this tool.


Stores the *validation state* for all registered components. It's important
to note that this is not the form values, just whether the current values
are valid, invalid, or not yet validated.

The value for each key will be:

* `true`: component is valid
* `false`: component is invalid
* `null`: component is not yet validated

@type {Object}


### `getState(fieldName) -> Boolean | null`

Get the current validation state for the field `name="fieldName"`. Returns
`true`, `false`, or `null`.

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
