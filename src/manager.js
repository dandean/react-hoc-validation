/**
 * @class FormManager
 *
 * The FormManager is the central point of coordination between the various
 * components in this tool.
 */
export default class FormManager {
  /**
   * Map of React HOC components by name attribute.
   *
   * @type {Map}
   */
  components = new Map([]);

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

  constructor() {
    this.handleValidationChange = this.handleValidationChange.bind(this);
  }

  /**
   * Register a component for validation. Components call this method within
   * their own `componentWillMount` method.
   *
   * @param {Component} component A higher order validation component
   */
  registerValidatedComponent(component) {
    const name = component.getName();

    if (component.type === 'RadioWrapper') {
      // If component is a RadioWrapper, register it with the group with the
      // corresponding name:
      const group = this.components.get(name);
      if (group === undefined) {
        throw new Error('RadioWrapper requires a RadioGroup with the same name')
      }
      group.registerValidatedComponent(component);

    } else {
      // Listen for when the validation state changes and store a component ref:
      component.addListener('validationChange', this.handleValidationChange);
      this.components.set(component.getName(), component);
    }
  }

  /**
   * Unregister a component for validation. Components call this method within
   * their own `componentWillUnmount` method:
   *
   * @param {Component} component A higher order validation component
   */
  unregisterValidatedComponent(component) {
    if (component.type === 'RadioWrapper') {
      const group = this.components.get(name);

      // RadioGroup will unmount before RadioWrapper if nested, so no need to
      // unregister if it's already gone:
      if (group) {
        group.unregisterValidatedComponent(component);
      }

    } else {
      component.removeListener('validationChange', this.handleValidationChange);
      this.components.delete(component.getName());
    }
  }

  /**
   * When the validation state changes (true, false, null) on a component.
   *
   * @param {String} name                The input's name attribute
   * @param {Boolean|null} previousState The previous state
   * @param {Boolean|null} nextState     The next state
   */
  handleValidationChange(name, previousState, nextState) {
    this.state[name] = nextState;
  }

  /**
   * Get the current validation state for field `name`.
   *
   * @param {String} name The name of the field by name attribute
   * @return {Boolean|null} The current validation state
   */
  getFieldValidationState(name) {
    const state = this.state[name];
    return state === undefined ? null : state ;
  }

  /**
   * Get the current validation message associated with field `name`.
   *
   * @param {String} name The name of the field by "name" attribute
   * @return {String} The validation message
   */
  getFieldValidationMessage(name) {
    const component = this.components.get(name);
    if (component) {
      return component.getValidationStateMessage();
    }
  }

  /**
   * If any field is currently "valid" (not false, not null).
   *
   * @return {Boolean}
   */
  getIsAnyFieldInvalid() {
    let isValid = true;
    this.components.forEach((component, name) => {
      if (isValid === true && component.getValidationState() === false) {
        isValid = false;
      }
    });

    return isValid === false;
  }

  /**
   * Validates every registered field
   *
   * @param {Function} [callback] Called when all fields have been validated
   */
  validate(callback = ()=>{}) {
    const count = this.components.size;
    let completed = 0;

    const done = (result) => {
      completed++;
      if (count === completed) {
        // Wait a tick to allow event emitter handlers to complete
        process.nextTick(callback);
      }
    }

    this.components.forEach((component, name) => {
      component.validate(done);
    });
  }
}
