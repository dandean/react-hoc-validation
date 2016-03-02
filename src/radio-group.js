import { EventEmitter } from 'events';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FormValidationManager from './manager';
import invariant from 'invariant';

export default class RadioGroup extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    manager: PropTypes.instanceOf(FormValidationManager).isRequired,
    validators: PropTypes.arrayOf(PropTypes.func),

    validateOnChange: PropTypes.bool,
    validateOnChangeDelay: PropTypes.number,

    onValidationChange: PropTypes.func
  };

  static defaultProps = {
    validateOnChange: true,
    validateOnChangeDelay: 500
  };

  state = {
    valid: null,
    validationMessage: null
  };

  radios = new Set([]);

  onChangeTimeout = null;

  constructor(...args) {
    super(...args);
    EventEmitter.call(this);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }

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

  componentWillMount() {
    this.props.manager.registerValidatedComponent(this);
  }

  componentWillUnmount() {
    this.radios.forEach((radio) => {
      this.unregisterValidatedComponent(radio);
    });
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

  handleChange(event) {
    if (this.state.valid !== null) {
      this.setState({
        valid: null,
        validationMessage: null
      });
    }

    clearTimeout(this.onChangeTimeout);

    if (this.props.validateOnChange) {
      this.onChangeTimeout = setTimeout(this.validate, this.props.validateOnChangeDelay);
    }
  }

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

  validate(callback = (isValid, message)=>{}) {
    // Clear timeout in case validate() was called while a change was queued.
    // This will prevent a potential double validation.
    if (this.props.validateOnChange) {
      clearTimeout(this.onChangeTimeout);
    }

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
          validationMessage: message
        });
        callback(isValid, message);
        return;
      }

      validators[index](value, (result) => {
        index++;

        if (result !== true) {
          isValid = false;
          message = result;
        }

        next();
      });
    }

    next();
  }

  render() {
    return this.props.children || <noscript />;
  }
}
Object.assign(RadioGroup.prototype, EventEmitter.prototype);
