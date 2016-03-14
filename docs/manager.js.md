@class FormManager

The FormManager is the central point of coordination between the various
components in this tool.


Map of React HOC components by name attribute.

@type {Map}


Stores the *validation state* for all registered components. It's important
to note that this is not the form values, just whether the current values
are valid, invalid, or not yet validated.

The value for each key will be:

* `true`: component is valid
* `false`: component is invalid
* `null`: component is not yet validated

@type {Object}


Get the current validation state for field `name`.

@param {String} name The name of the field by name attribute
@return {Boolean|null} The current validation state


Get the current validation message associated with field `name`.

@param {String} name The name of the field by "name" attribute
@return {String} The validation message


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
