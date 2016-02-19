# React Higher Order Component Form Validation

This modules makes use of higher order components to decorate straight forward
form markup with validation rules.


## Goals

* Declarative implementation
* Straight forward integration
* No custom form element components in the library
* Compatible with your own custom form element components
* No class inheritance
* Async-compatible validation functions enabling remote tests


## Example Markup

```
<Validated manager={validationManager} validators={[required(), minLength(10)]}>
  <input type="text" name="example" />
</Validated>
```


## Work in Progress

Lot's to do! Maybe I'll get something useful out of it :)
