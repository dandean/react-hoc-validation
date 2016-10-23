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
export default function Message(props, context) {
  const message = context.formValidationManager.getMessage(props.name);

  if (message) {
    return <span>{message}</span>
  }

  {/* in react 15 this can be `null` */}
  return <noscript />;
}

Message.contextTypes = {
  formValidationManager: PropTypes.instanceOf(FormValidationManager).isRequired
};

Message.propTypes = {
  name: PropTypes.string.isRequired
};
