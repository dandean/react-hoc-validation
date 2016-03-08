import { EventEmitter } from 'events';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FormValidationManager from './manager';
import invariant from 'invariant';

export default class RadioGroup extends Component {
  static contextTypes = {
    formValidationManager: PropTypes.instanceOf(FormValidationManager).isRequired
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    validators: PropTypes.arrayOf(PropTypes.func),

    validateOnChange: PropTypes.bool,
    validateOnChangeDelay: PropTypes.number,

    onValidationChange: PropTypes.func
  };

  state = {
    valid: null,
    validationMessage: null,
    isValidating: false
  };

  radios = new Set([]);

  onChangeTimeout = null;
  validateOnChange = null;
  validateOnChangeDelay = null;

  constructor(...args) {
    super(...args);
    EventEmitter.call(this);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  //
  // GETTERS
  // ---------------------------------------------------------------------------

  getName() {
    return this.props.name;
  }

  getValue() {
    let value = null;

    this.radios.forEach((radio) => {
      if (value === null && radio.getIsChecked()) {
        value = radio.getValue();
      }
    });

    return value;
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

  registerValidatedComponent(radio) {
    radio.addListener('change', this.handleChange);
    this.radios.add(radio);
  }

  unregisterValidatedComponent(radio) {
    if (radio) {
      radio.removeListener('change', this.handleChange);
      this.radios.delete(radio);
    }
  }

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

  validate(callback = (isValid, message)=>{}) {
    // Clear timeout in case validate() was called while a change was queued.
    // This will prevent a potential double validation.
    if (this.validateOnChange) {
      clearTimeout(this.onChangeTimeout);
    }

    this.setState({ isValidating: true });

    const value = this.getValue();

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
    const manager = this.context.formValidationManager;
    manager.registerValidatedComponent(this);

    this.validateOnChange = this.props.validateOnChange || manager.validateOnChange;

    if (this.props.validateOnChangeDelay !== undefined) {
      this.validateOnChangeDelay = this.props.validateOnChangeDelay;

    } else {
      this.validateOnChangeDelay = manager.validateOnChangeDelay;
    }
  }

  componentWillUnmount() {
    this.radios.forEach((radio) => {
      this.unregisterValidatedComponent(radio);
    });
    this.context.formValidationManager.unregisterValidatedComponent(this);
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
    return this.props.children || <noscript />;
  }
}
Object.assign(RadioGroup.prototype, EventEmitter.prototype);
