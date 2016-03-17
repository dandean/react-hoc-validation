# RadioGroup

The `<RadioGroup>` component decorates a group of `<input type="radio">`,
elements with validation properties and configuration.

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
