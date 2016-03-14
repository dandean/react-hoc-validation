# FormWrapper

The `<FormWrapper>` component decorates a `<form>` element with default
validation properties and configuration.

```html
<FormWrapper manager={formValidationManager} onValidationChange={handleValidationChange}>
  <form>
    Your form controls in here
  </form>
</FormWrapper>
```


## Properties

The `manager` prop is required. Every other prop in documented in
[standard component props](./README.md#standard-component-props).


### `manager={FormValidationManager}`

The manager prop must be an instance of `FormValidationManager`. You must
create this instance yourself, probably in `componentWillMount`, and it
may not be used by more than one `<FormWrapper>`.
