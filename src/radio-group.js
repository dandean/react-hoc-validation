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

  onChangeTimeout = null;

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

    this.props.manager.registerValidatedRadioComponent(this);
  }

  componentWillUnmount() {
    this.props.manager.unregisterValidatedRadioComponent(this);
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
