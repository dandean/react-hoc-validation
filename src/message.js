import React, { Component, PropTypes } from 'react';
import FormValidationManager from './manager';

/**
 * # Message
 *
 * The `<Message>` component decorates renders the message for field `name`.
 *
 * ```html
 * <Message name="username" />
 * ```
 */
export default class Message extends Component {
  static contextTypes = {
    formValidationManager: PropTypes.instanceOf(FormValidationManager).isRequired
  };

  /**
   * ## Props
   *
   * All props are documented in [standard component props](./README.md#standard-component-props).
   */
  static propTypes = {
    name: PropTypes.string.isRequired
  };

  render() {
    const message = this.context.formValidationManager.getMessage(this.props.name);

    if (message) {
      return <span>{message}</span>
    }

    return null;
  }
}
