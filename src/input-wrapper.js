import { EventEmitter } from 'events';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FormValidationManager from './manager';
import invariant from 'invariant';

export default class InputWrapper extends Component {
  static propTypes = {
    /**
     * Because this is a higher order component, only a single child component
     * is allowed, and it is required.
     *
     * @type {Component}
     */
    children: PropTypes.element.isRequired,

    /**
     * The FormManager instance, which is required in order to enable validation.
     *
     * @type {FormManager}
     */
    manager: PropTypes.instanceOf(FormValidationManager).isRequired,

    /**
     * An array of validation functions. All functions:
     *
     * * take `value` as the first argument
     * * take `callback` as the second argument
     * * pass true if valid or a string if invalid to the callback
     *
     * @type {Array}
     */
    validators: PropTypes.arrayOf(PropTypes.func),

    /**
     * If the component's validators should run when the input's value changes.
     *
     * @type {Boolean}
     */
    validateOnChange: PropTypes.bool,

    /**
     * How long (in milliseconds) to wait after the value has changed before
     * running validators.
     *
     * @type {Number}
     */
    validateOnChangeDelay: PropTypes.number,

    validateOnBlur: PropTypes.bool,

    /**
     * Handler to call when validation state changes.
     *
     * @type {Function}
     */
    onValidationChange: PropTypes.func
  };

  static defaultProps = {
    validators: []
  };

  state = {
    valid: null,
    validationMessage: null,
    isValidating: false
  };

  onChangeTimeout = null;
  validateOnChange = null;
  validateOnChangeDelay = null;

  constructor(...args) {
    super(...args);
    EventEmitter.call(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.validate = this.validate.bind(this);
  }

  //
  // GETTERS
  // ---------------------------------------------------------------------------

  getName() {
    return this.props.children.props.name;
  }

  getValidationState() {
    return this.state.valid;
  }

  getValidationStateMessage() {
    return this.state.validationMessage;
  }

  getIsValidating() {
    return this.state.isValidating;
  }

  //
  // VALIDATION INTEGRATION
  // ---------------------------------------------------------------------------

  handleChange(event) {
    if (this.state.valid !== null) {
      this.setState({
        valid: null,
        validationMessage: null
      });
    }

    clearTimeout(this.onChangeTimeout);

    if (this.validateOnChange) {
      this.onChangeTimeout = setTimeout(this.validate, this.validateOnChangeDelay);
    }
  }

  handleBlur(event) {
    if (this.state.valid === null && this.validateOnBlur) {
      this.validate();
    }
  }

  validate(callback = (isValid, message)=>{}) {
    // Clear timeout in case validate() was called while a change was queued.
    // This will prevent a potential double validation.
    if (this.validateOnChange || this.validateOnBlur) {
      clearTimeout(this.onChangeTimeout);
    }

    this.setState({ isValidating: true });

    // TODO: Should this use `this.props.children.props.value`?
    const element = ReactDOM.findDOMNode(this);
    let value = element.value;

    // Clear checkbox value when checkbox is not checked:
    if (element.type === 'checkbox' && element.checked === false) {
      value = '';
    }

    // Run through all validation routines...
    const { validators } = this.props;
    let index = 0;

    // Valid until any validators fail:
    let isValid = true;
    let message = null;

    let next = () => {
      if (isValid === false || !Boolean(validators[index])) {
        this.setState({
          valid: isValid,
          validationMessage: message,
          isValidating: false
        });
        callback(isValid, message);
        return;
      }

      validators[index](value, (result) => {
        index++;

        if (Boolean(result)) {
          isValid = false;
          message = result;
        }

        next();
      });
    }

    next();
  }

  //
  // REACT LIFECYCLE
  // ---------------------------------------------------------------------------

  componentWillMount() {
    const { children } = this.props;
    invariant(
      children && children.props && children.props.name,
      'A child component with a "name" property is required'
    );

    if (children.type === 'input' && children.props.type === 'checkbox') {
      // Checkbox inputs must have a value attribute set:
      // https://www.w3.org/TR/html4/interact/forms.html#adef-value-INPUT
      invariant(
        children.props && children.props.value,
        `Inputs of type checkbox must have a value property`
      );
    }

    this.props.manager.registerValidatedComponent(this);

    this.validateOnChange = this.props.validateOnChange || this.props.manager.validateOnChange;

    if (this.props.validateOnChangeDelay !== undefined) {
      this.validateOnChangeDelay = this.props.validateOnChangeDelay;

    } else {
      this.validateOnChangeDelay = this.props.manager.validateOnChangeDelay;
    }

    this.validateOnBlur = this.props.validateOnBlur || this.props.manager.validateOnBlur;
  }

  componentWillUnmount() {
    this.props.manager.unregisterValidatedComponent(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.valid !== nextState.valid) {
      if (this.props.onValidationChange) {
        this.props.onValidationChange(this.state.valid, nextState.valid);
      }

      if (this.listenerCount('validationChange') > 0) {
        const name = this.getName();
        this.emit('validationChange', name, this.state.valid, nextState.valid);
      }
    }
  }

  render() {
    let handleChange = this.handleChange;
    const originalOnChange = this.props.children.props.onChange;

    if (originalOnChange) {
      handleChange = (event) => {
        originalOnChange(event);
        this.handleChange(event);
      }
    }

    let handleBlur = this.handleBlur;
    const originalOnBlur = this.props.children.props.onBlur

    if (originalOnBlur) {
      handleBlur = (event) => {
        originalOnBlur(event);
        this.handleBlur(event);
      }
    }

    const element = React.cloneElement(
      this.props.children, {
        onBlur: handleBlur,
        onChange: handleChange
      }
    );
    return element;
  }
}
Object.assign(InputWrapper.prototype, EventEmitter.prototype);
