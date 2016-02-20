import { EventEmitter } from 'events';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import FormValidationManager from './manager';
import invariant from 'invariant';

export default class InputWrapper extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,

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

  onChangeTimeout = null;

  constructor(...args) {
    super(...args);
    EventEmitter.call(this);
  }

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

  getName() {
    return this.props.children.props.name;
  }

  getValidationState() {
    return this.state.valid;
  }

  getValidationStateMessage() {
    return this.state.validationMessage;
  }

  @autobind
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

  @autobind
  handleBlur(event) {
    if (this.state.valid === null) {
      this.validate();
    }
  }

  @autobind
  validate(callback = (isValid, message)=>{}) {
    // Clear timeout in case validate() was called while a change was queued.
    // This will prevent a potential double validation.
    if (this.props.validateOnChange) {
      clearTimeout(this.onChangeTimeout);
    }

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
