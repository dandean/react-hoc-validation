# RadioWrapper

The `<RadioWrapper>` component wraps `<input type="radio">` elements,
associating them with a `<RadioGroup>` component with the same name. The
`<RadioWrapper>` component has no props of its own; all validation
configuration is located on the parent `<RadioGroup>`.

**See [`<RadioGroup>`](./radio-group.js) to learn more.**

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
