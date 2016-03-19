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
Returns `undefined` when the field is


If any field is currently "valid" (not false, not null).

@return {Boolean}


Register a component for validation. Components call this method within
their own `componentWillMount` method.

@param {Component} component A higher order validation component


Unregister a component for validation. Components call this method within
their own `componentWillUnmount` method:

@param {Component} component A higher order validation component


When the validation state changes (true, false, null) on a component.

@param {String} name                The input's name attribute
@param {Boolean|null} previousState The previous state
@param {Boolean|null} nextState     The next state


Validates every registered field

@param {Function} [callback] Called when all fields have been validated
