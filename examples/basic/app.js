import React, { Component } from 'react'
import { render } from 'react-dom'
import classnames from 'classnames';

import {
  FormValidationManager,
  FormWrapper,
  InputWrapper,
  validators
} from 'react-hoc-validation';

const required = validators.createRequired('Username is required');

class App extends Component {
  state = {
    // Store validation state so that we can trigger render by updating it when
    // the manager's validation state changes:
    validation: {}
  };

  componentWillMount() {
    // Create a form validation manager for this component's form:
    this.manager = new FormValidationManager();
  }

  handleValidationChange(previousValue, nextValue) {
    // Handle the validation state change on the input.
    this.setState({
      validation: this.manager.state
    });
  }

  render() {
    // Get the validation state for our field:
    const usernameState = this.manager.getState('username');

    // Build a class name:
    const usernameMessageClassName = classnames('message', {
      valid:        usernameState === true,
      invalid:      usernameState === false,
      notvalidated: usernameState === null
    });

    return (
      <div>
        <FormWrapper manager={this.manager} onValidationChange={this.handleValidationChange.bind(this)}>
          <form>
            <label htmlFor="username">Username</label>
            <InputWrapper validators={[required]}>
              <input type="text" name="username" id="username" />
            </InputWrapper>
            <span className={usernameMessageClassName}>
              {this.manager.getMessage('username')}
            </span>

            <br />
            <input type="submit" value="submit" />
          </form>
        </FormWrapper>
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('example')
);
