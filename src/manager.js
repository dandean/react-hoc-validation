import { EventEmitter } from 'events';
import invariant from 'invariant';

const _isValidating_ = Symbol();
const _components_ = Symbol();

/**
 * # FormManager
 *
 * `FormManager` is the central point of coordination between the various
 * components in this tool.
 */
export default class FormManager extends EventEmitter {
  /**
   * Stores the *validation state* for all registered components. It's important
   * to note that this is not the form values, just whether the current values
   * are valid, invalid, or not yet validated.
   *
   * The value for each key will be:
   *
   * * `true`: component is valid
   * * `false`: component is invalid
   * * `null`: component is not yet validated
   *
   * @type {Object}
   */
  state = {};

  validationChangeTimeout = null;

  validateOnChange = true;
  validateOnChangeDelay = 500;
  validateOnBlur = true;

  constructor() {
    super();

    this[_components_] = new Map([]);
    this[_isValidating_] = false;

    this.handleValidationChange = this.handleValidationChange.bind(this);
  }

  //
  // GETTERS
  // ---------------------------------------------------------------------------

  /**
   * ### `getState(fieldName) -> Boolean | null`
   *
   * Get the current validation state for the field `name="fieldName"`. Returns
   * `true`, `false`, or `null`.
   *
   * * `true`: valid
   * * `false`: invalid
   * * `null`: not yet validated
   */
  getState(name) {
    const state = this.state[name];
    return state === undefined ? null : state ;
  }

  /**
   * ### `getMessage(fieldName) -> String | undefined`
   *
   * Get the current validation message for the field `name="fieldName"`.
   */
  getMessage(name) {
    const component = this[_components_].get(name);
    invariant(Boolean(component), `Field ${name} does not exist`);

    const message = component.getValidationStateMessage();
    return message;
  }

  /**
   * ### `getIsAnyFieldInvalid() -> Boolean`
   *
   * If any field is currently invalid.
   */
  getIsAnyFieldInvalid() {
    let isValid = true;
    this[_components_].forEach((component, name) => {
      if (isValid === true && component.getValidationState() === false) {
        isValid = false;
      }
    });

    return isValid === false;
  }

  /**
   * ### `getIsValidating() -> Boolean`
   *
   * If validation functions are currently executing.
   */
  getIsValidating() {
    // If form is validating, return `true` early:
    if (this[_isValidating_] === true){
      return true;
    }

    // Otherwise, we have to iterate all validation components until we either
    // find one or run out:

    let isValidating = false;

    for (let [name, component] of this[_components_].entries()) {
      if (component.getIsValidating() === true) {
        isValidating = true;
        break;
      }
    }

    return isValidating;
  }

  //
  // VALIDATION INTEGRATION
  // ---------------------------------------------------------------------------

  // Register a component for validation. Components call this method within
  // their own `componentWillMount` method.
  //
  // @param {Component} component A higher order validation component
  registerValidatedComponent(component) {
    const name = component.getName();

    if (component.type === 'RadioWrapper') {
      // If component is a RadioWrapper, register it with the group with the
      // corresponding name:
      const group = this[_components_].get(name);
      if (group === undefined) {
        throw new Error('RadioWrapper requires a RadioGroup with the same name')
      }
      group.registerValidatedComponent(component);

    } else {
      // Listen for when the validation state changes and store a component ref:
      component.addListener('validationChange', this.handleValidationChange);
      this[_components_].set(component.getName(), component);
    }
  }

  // Unregister a component for validation. Components call this method within
  // their own `componentWillUnmount` method.
  //
  // @param {Component} component A higher order validation component
  unregisterValidatedComponent(component) {
    if (component.type === 'RadioWrapper') {
      const group = this[_components_].get(name);

      // RadioGroup will unmount before RadioWrapper if nested, so no need to
      // unregister if it's already gone:
      if (group) {
        group.unregisterValidatedComponent(component);
      }

    } else {
      component.removeListener('validationChange', this.handleValidationChange);
      this[_components_].delete(component.getName());
    }
  }

   // When the validation state changes (true, false, null) on a component.
   //
   // @param {String} name                The input's name attribute
   // @param {Boolean|null} previousState The previous state
   // @param {Boolean|null} nextState     The next state
  handleValidationChange(name, previousState, nextState) {
    this.state[name] = nextState;

    clearTimeout(this.validationChangeTimeout);
    this.validationChangeTimeout = setTimeout(() => this.emit('change'), 0);
  }

  /**
   * ### `validate([callback])`
   *
   * Validates every registered field. Callback is called once all validators
   * have completed. `validate()` is called automatically when the form is
   * submitted.
   */
  validate(callback = ()=>{}) {
    this[_isValidating_] = true;

    const count = this[_components_].size;
    let completed = 0;

    const done = (result) => {
      completed++;
      if (count === completed) {
        this[_isValidating_] = false;

        // Wait a tick to allow event emitter handlers to complete
        process.nextTick(callback);
      }
    }

    this[_components_].forEach((component, name) => {
      component.validate(done);
    });
  }
}
