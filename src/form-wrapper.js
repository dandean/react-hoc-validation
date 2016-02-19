import React, { Component, PropTypes } from 'react';
import FormValidationManager from './manager';

export default class FormWrapper extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    manager: PropTypes.instanceOf(FormValidationManager).isRequired
  };

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
