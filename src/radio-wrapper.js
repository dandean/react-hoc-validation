import { EventEmitter } from 'events';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FormValidationManager from './manager';
import invariant from 'invariant';

export default class RadioWrapper extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    manager: PropTypes.instanceOf(FormValidationManager).isRequired
  };

  type = 'RadioWrapper';

  constructor(...args) {
    super(...args);
    EventEmitter.call(this);
    this.handleChange = this.handleChange.bind(this);
  }

  //
  // GETTERS
  // ---------------------------------------------------------------------------

  getName() {
    return this.props.children.props.name;
  }

  getValue() {
    return this.props.children.props.value;
  }

  getIsChecked() {
    const element = ReactDOM.findDOMNode(this);
    return element.checked;
  }

  //
  // VALIDATION INTEGRATION
  // ---------------------------------------------------------------------------

  handleChange(event) {
    this.emit('change', event);
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

  render() {
    let handleChange = this.handleChange;

    // Handler attached directly to the <input>:
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
