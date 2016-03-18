# RadioGroup

The `<RadioGroup>` component decorates a group of `<input type="radio">`,
elements with validation properties and configuration. Each radio input
must be wrapped in a `<RadioWrapper>` in order for the `<RadioGroup>` to know
about them.

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


## Props

All props are documented in [standard component props](./README.md#standard-component-props),
with the exception of `validateOnBlur`, which does not apply to
`<RadioGroup>`.
