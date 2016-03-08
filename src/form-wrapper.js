import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import FormValidationManager from './manager';

export default class FormWrapper extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    manager: PropTypes.instanceOf(FormValidationManager).isRequired,
    onValidationChange: PropTypes.func,
    validateOnChange: PropTypes.bool,
    validateOnChangeDelay: PropTypes.number,
    validateOnBlur: PropTypes.bool
  };

  static childContextTypes = {
    formValidationManager: PropTypes.instanceOf(FormValidationManager)
  };

  getChildContext() {
    return {
      formValidationManager: this.props.manager
    }
  };

  componentWillMount() {
    invariant(
      this.props.children && this.props.children.type === 'form',
      'FormWrapper can only wrap <form> elements'
    );

    this.handleValidationChange = this.handleValidationChange.bind(this);
    this.props.manager.addListener('change', this.handleValidationChange);

    if (this.props.validateOnChange !== undefined) {
      this.props.manager.validateOnChange = this.props.validateOnChange;
    }

    if (this.props.validateOnChangeDelay !== undefined) {
      this.props.manager.validateOnChangeDelay = this.props.validateOnChangeDelay;
    }

    if (this.props.validateOnBlur !== undefined) {
      this.props.manager.validateOnBlur = this.props.validateOnBlur;
    }
  }

  componentWillUnmount() {
    this.props.manager.removeListener('change', this.handleValidationChange);
  }

  handleValidationChange() {
    if (this.props.onValidationChange) {
      this.props.onValidationChange();
    }
  }

  render() {
    const originalOnSubmit = this.props.children.props.onSubmit;
    const manager = this.props.manager;

    // When the wrapped form element submits, handle it...
    const form = React.cloneElement(
      this.props.children, {
        // TODO: do not overwrite existing `onSubmit` function, wrap it:
        onSubmit: (event) => {
          event.preventDefault();
          manager.validate(() => {
            if (originalOnSubmit && manager.getIsAnyFieldInvalid() === false) {
              originalOnSubmit(event);
            }
          })
        }
      }
    );
    return form;
  }
}
