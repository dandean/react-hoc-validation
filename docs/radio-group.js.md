# RadioGroup

The `<RadioGroup>` component decorates a group of `<input type="radio">`,
elements with validation properties and configuration.

The `<RadioGroup>` component’s props are the place to configure the validator
functions **and** to override the default configuration settings associated
with a group of radio inputs from `<FormWrapper>`.

```html
<RadioGroup name="foo" validators={[fn]}>
  <div>
    <RadioWrapper>
      <input type="radio" name="foo" value="1" />
    </RadioWrapper>
    <RadioWrapper>
      <input type="radio" name="foo" value="2" />
    </RadioWrapper>
  </div>
</RadioGroup>
```
