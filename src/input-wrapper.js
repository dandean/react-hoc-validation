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
        const name = ReactDOM.findDOMNode(this).name;
        this.emit('validationChange', name, this.state.valid, nextState.valid);
      }
    }
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

    // Run through all validation routines...
    const value = ReactDOM.findDOMNode(this).value;

    const { validators } = this.props;
    const count = validators.length;
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
