import { EventEmitter } from 'events';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import FormValidationManager from './manager';
import invariant from 'invariant';

export class RadioGroup extends Component {
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

  registerValidatedComponent(radio) {
    this.radios.add(radio);
  }

  unregisterValidatedComponent(radio) {
    this.radios.delete(radio);
  }

  componentWillMount() {
    this.props.manager.registerValidatedComponent(this);
  }

  componentWillUnmount() {
    this.props.manager.unregisterValidatedComponent(this);
  }

  getName() {
    return this.props.name;
  }

  getValidationState() {
    return this.state.valid;
  }

  getValidationStateMessage() {
    return this.state.validationMessage;
  }

  @autobind
  validate(callback = (isValid, message)=>{}) {
    // Clear timeout in case validate() was called while a change was queued.
    // This will prevent a potential double validation.
    if (this.props.validateOnChange) {
      clearTimeout(this.onChangeTimeout);
    }

    // TODO: find the value from associated radios...
    let value = null;

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


// ----


export default class RadioWrapper extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    manager: PropTypes.instanceOf(FormValidationManager).isRequired
  };

  type = 'RadioWrapper';

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

    if (children.type === 'input' && children.props.type === 'radio') {
      // Checkbox inputs must have a value attribute set:
      // https://www.w3.org/TR/html4/interact/forms.html#adef-value-INPUT
      invariant(
        children.props && children.props.value,
        `Inputs of type radio must have a value property`
      );
    }

    this.props.manager.registerValidatedComponent(this);
  }

  componentWillUnmount() {
    this.props.manager.unregisterValidatedComponent(this);
  }

  getName() {
    return this.props.children.props.name;
  }

  @autobind
  handleChange(event) {
    this.emit('change');

    // TODO:
    // manager should have RadioGroup listen to this change event
    // RadioGroup should validate itself against this
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

    const element = React.cloneElement(
      this.props.children, {
        onChange: handleChange
      }
    );
    return element;
  }
}
Object.assign(RadioWrapper.prototype, EventEmitter.prototype);
