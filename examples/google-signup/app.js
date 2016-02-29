import React, { Component } from 'react'
import { render } from 'react-dom'
import classnames from 'classnames';

import {
  FormValidationManager,
  FormWrapper,
  InputWrapper
} from 'react-hoc-validation';

function required(value, callback) {
  callback(value.trim().length > 0 ? true : 'You can\'t leave this empty.');
}

function termsOfService(value, callback) {
  required(value, (message) => {
    if (typeof message === 'string') {
      message = 'In order to use our services, you must agree to Google\'s Terms of Service.';
      callback(message);
    }
  });
}

function username(value, callback) {
  const valid = /^[\w.]+$/.test(value);
  callback(valid === true ? true : 'Please use only letters (a-z), numbers, and periods.')
}

class App extends Component {
  state = {
    // Store validation state so that we can trigger render by updating it when
    // the manager's validation state changes:
    validation: {}
  };

  componentWillMount() {
    // Create a form validation manager for this component's form:
    this.manager = new FormValidationManager();
    this.passwordConfirmation = this.passwordConfirmation.bind(this);
  }

  handleValidationChange(previousValue, nextValue) {
    // Handle the validation state change on the input.
    this.setState({
      validation: this.manager.state
    });
  }

  handleSubmit(event) {
    if (!event.isDefaultPrevented()) {
      event.preventDefault();
    }
  }

  passwordConfirmation(value, callback) {
    const password = this.refs.password.value;
    const valid = value === password;
    callback(valid ? true : 'These passwords don\'t match. Try again?');
  }

  getDateOfBirthMessage() {
    const month = this.manager.getFieldValidationMessage('BirthMonth');
    const day = this.manager.getFieldValidationMessage('BirthDay');
    const year = this.manager.getFieldValidationMessage('BirthYear');
    return month || day || year ;
  }

  getFullNameMessage() {
    const first = this.manager.getFieldValidationMessage('FirstName');
    const last = this.manager.getFieldValidationMessage('LastName');
    return first || last ;
  }

  render() {
    const errorClass = (name) => {
      const state = this.manager.getFieldValidationState(name);
      return state === false ? 'form-error' : '' ;
    }

    return (
      <div className="wrapper" id="wrapper">
        <div className="google-header-bar">
          <div className="header content clearfix">
            <img className="logo logo-w" src="//ssl.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_112x36dp.png" alt="Google" />
            <span className="signin-button">
              <a id="link-signin" className="g-button g-button-submit" href="https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fplus.google.com%2Fcollections%2Ffeatured&amp;dsh=-7331298892027821408">Sign in</a>
            </span>
          </div>
        </div>
        <div className="signuponepage main content clearfix">
          <noscript />
          <h1>Create your Google Account</h1>
          <div className="clearfix">
            <div className="sign-up">
              <div className="signup-box">
                <FormWrapper manager={this.manager}>
                <form className="createaccount-form" id="createaccount" name="createaccount" onSubmit={this.handleSubmit.bind(this)}>
                  <div className="form-element multi-field name" id="name-form-element">
                    <fieldset>
                      <legend><strong>Name</strong></legend>
                      <label id="firstname-label" className="firstname">
                        <strong>First name</strong>
                        <InputWrapper manager={this.manager} validators={[required]} onValidationChange={this.handleValidationChange.bind(this)}>
                          <input className={errorClass('FirstName')} type="text" name="FirstName" id="FirstName" spellCheck="false" n="1" placeholder="First" />
                        </InputWrapper>
                      </label>
                      
                      <label id="lastname-label" className="lastname">
                        <strong>Last name</strong>
                        <InputWrapper manager={this.manager} validators={[required]} onValidationChange={this.handleValidationChange.bind(this)}>
                          <input className={errorClass('LastName')} type="text" name="LastName" id="LastName" spellCheck="false" n="2" placeholder="Last" />
                        </InputWrapper>
                      </label>
                    </fieldset>
    
                    <span role="alert" className="errormsg">{this.getFullNameMessage()}</span>
                  </div>

                  <div className="form-element email-address" id="gmail-address-form-element">
                    <label id="gmail-address-label">
                      <strong>Choose your username</strong>
                      <InputWrapper manager={this.manager} validators={[required, username]} onValidationChange={this.handleValidationChange.bind(this)}>
                        <input className={errorClass('GmailAddress')} type="text" maxLength="30" autoComplete="off" name="GmailAddress" id="GmailAddress" spellCheck="false" n="3" />
                      </InputWrapper>
                      <span className="atgmail">@gmail.com</span>
                    </label>
      
                    <div className="linkmsg">
                      <a href="" tabIndex="0" id="signup-without-gmail-link">I prefer to use my current email address</a>
                    </div>

                    <div id="username-errormsg-and-suggestions">
                      <span role="alert" className="errormsg">{this.manager.getFieldValidationMessage('GmailAddress')}</span>
                      <div id="EmailAddressExistsError" style={{display: "none"}}>
                        This email address already corresponds to a Google Account. Please <a href="https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fplus.google.com%2Fcollections%2Ffeatured&amp;dsh=-7331298892027821408">sign in</a> or, if you forgot your password, <a href="https://accounts.google.com/RecoverAccount?continue=https%3A%2F%2Fplus.google.com%2Fcollections%2Ffeatured">reset it</a>.
                      </div>
                      <div className="username-suggestions" id="username-suggestions"></div>
                    </div>
                  </div>

                  <div className="form-element" id="password-form-element">
                    <label id="password-label">
                      <strong>Create a password</strong>
                      <InputWrapper manager={this.manager} validators={[required]} onValidationChange={this.handleValidationChange.bind(this)}>
                        <input ref="password" type="password" name="Passwd" id="Passwd" n="4"/>
                      </InputWrapper>
                    </label>
                    <span role="alert" className="errormsg">{this.manager.getFieldValidationMessage('Passwd')}</span>
                  </div>

                  <div className="form-element" id="confirm-password-form-element">
                    <label id="confirm-password-label">
                      <strong>Confirm your password</strong>
                      <InputWrapper manager={this.manager} validators={[required, this.passwordConfirmation]} onValidationChange={this.handleValidationChange.bind(this)}>
                        <input type="password" name="PasswdAgain" id="PasswdAgain" n="5"/>
                      </InputWrapper>
                    </label>
                    <span role="alert" className="errormsg">{this.manager.getFieldValidationMessage('PasswdAgain')}</span>
                  </div>

                  <div className="form-element multi-field birthday" id="birthday-form-element">
                    <fieldset>
                      <legend><strong id="BirthdayLabel">Birthday</strong></legend>
                      <label id="month-label" className="month">
                        <span id="BirthMonth">
                          <InputWrapper manager={this.manager} validators={[required]} onValidationChange={this.handleValidationChange.bind(this)}>
                            <select name="BirthMonth" className={'goog-inline-block ' + errorClass('BirthMonth')}>
                              <option value="">Month</option>
                              <option value="1">January</option>
                              <option value="2">February</option>
                              <option value="3">March</option>
                              <option value="4">April</option>
                              <option value="5">May</option>
                              <option value="6">June</option>
                              <option value="7">July</option>
                              <option value="8">August</option>
                              <option value="9">September</option>
                              <option value="10">October</option>
                              <option value="11">November</option>
                              <option value="12">December</option>
                            </select>
                          </InputWrapper>
                        </span>
                      </label>

                      <label id="day-label" className="day">
                        <strong>Day</strong>
                        <InputWrapper manager={this.manager} validators={[required]} onValidationChange={this.handleValidationChange.bind(this)}>
                          <input type="text" maxLength="2" name="BirthDay" id="BirthDay" placeholder="Day" className={errorClass('BirthDay')}/>
                        </InputWrapper>
                      </label>

                      <label id="year-label" className="year">
                        <strong>Year</strong>
                        <InputWrapper manager={this.manager} validators={[required]} onValidationChange={this.handleValidationChange.bind(this)}>
                          <input type="text" maxLength="4" name="BirthYear" id="BirthYear" placeholder="Year" className={errorClass('BirthYear')} />
                        </InputWrapper>
                      </label>
                    </fieldset>

                    <span role="alert" className="errormsg">{this.getDateOfBirthMessage()}</span>
                  </div>

                  <div className="form-element recovery-email" id="recovery-email-form-element">
                    <label id="recovery-email-label">
                      <strong>Your current email address</strong>
                      <input type="text" name="RecoveryEmailAddress" id="RecoveryEmailAddress" spellCheck="false" n="6"/>
                    </label>
                    <span role="alert" className="errormsg" id="errormsg_0_RecoveryEmailAddress"></span>
                  </div>

                  <div className="form-element terms-of-service" id="termsofservice-form-element">
                    <label id="termsofservice-label">
                      <InputWrapper manager={this.manager} validators={[termsOfService]} onValidationChange={this.handleValidationChange.bind(this)}>
                        <input className={errorClass('TermsOfService')} type="checkbox" value="yes" name="TermsOfService" id="TermsOfService"/>
                      </InputWrapper>
                      <span id="terms-of-service-label">
                        <strong>I agree to the Google <a target="_blank" id="TosLink" href="https://accounts.google.com/TOS?loc=US&amp;hl=en">Terms of Service</a> and <a target="_blank" id="PrivacyLink" href="https://accounts.google.com/TOS?loc=US&amp;hl=en&amp;privacy=true">Privacy Policy</a></strong>
                      </span>
                    </label>
                    <span role="alert" className="errormsg">{this.manager.getFieldValidationMessage('TermsOfService')}</span>
                  </div>

                  <div className="form-element" id="extra-tos"></div>
                  <div className="form-element nextstep-button">
                    <input id="submitbutton" name="submitbutton" type="submit" value="Next step" className="g-button g-button-submit" />
                  </div>
                </form>
                </FormWrapper>
              </div>

              <p className="why-information"><a target="_blank" href="https://support.google.com/accounts/answer/1733224?hl=en">Learn more</a> about why we ask for this information.</p>
            </div>

            <div className="side-content">
              <h2>One account is all you need</h2>
              <p>One free account gets you into everything Google.</p>

              <div className="logo-strip"></div>
              <h2>Take it all with you</h2>
              <p>Switch between devices, and pick up wherever you left off.</p>

              <div className="devices-icon"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

render(
  <App />,
  document.getElementById('example')
);
