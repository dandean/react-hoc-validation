## FormWrapper

The `<FormWrapper>` component decorates a `<form>` element with validation
properties and configuration. Because `<FormWrapper>` is a higher order
component, its rendered DOM element *is* the child `<form>` element.

The `<FormWrapper>` component’s props are the place to configure default
behavior for all child validation components.

```html
<FormWrapper>
  <form>
    Your form controls in here
  </form>
</FormWrapper>
```


### FormWrapper Props


#### `<FormWrapper manager={FormValidationManager}>`

The manager prop must be an instance of `FormValidationManager`. You must
create this instance yourself, probably in `componentWillMount`, and it
may not be used by more than one `<FormWrapper>`.


#### `<FormWrapper validateOnChange={Boolean:true}>`

Each input's validators are executed (after a delay) when the input’s
value changes. To prevent this, set `validateOnChange={false}`.


#### `<FormWrapper validateOnChangeDelay={Number:500}>`

The number of milliseconds after an input's value changes to wait until
executing validators.


#### `<FormWrapper validateOnBlur={Boolean:true}>`

Each input's validators are executed when the input's "blur" event fires.
To prevent this, set `validateOnBlur={false}`. This does not apply
to radio inputs.


#### `<FormWrapper onValidationChange={Function}>`

The function to call when the validation state changes on *any* validated
input. This is useful to trigger component state changes and thus display
validation messages to the user.
