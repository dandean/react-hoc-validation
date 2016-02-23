'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _manager = require('./manager');

var _manager2 = _interopRequireDefault(_manager);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var InputWrapper = (function (_Component) {
  _inherits(InputWrapper, _Component);

  _createClass(InputWrapper, null, [{
    key: 'propTypes',
    value: {
      /**
       * Because this is a higher order component, only a single child component
       * is allowed, and it is required.
       *
       * @type {Component}
       */
      children: _react.PropTypes.element.isRequired,

      /**
       * The FormManager instance, which is required in order to enable validation.
       *
       * @type {FormManager}
       */
      manager: _react.PropTypes.instanceOf(_manager2['default']).isRequired,

      /**
       * An array of validation functions. All functions:
       *
       * * take `value` as the first argument
       * * take `callback` as the second argument
       * * pass true if valid or a string if invalid to the callback
       *
       * @type {Array}
       */
      validators: _react.PropTypes.arrayOf(_react.PropTypes.func),

      /**
       * If the component's validators should run when the input's value changes.
       *
       * @type {Boolean}
       */
      validateOnChange: _react.PropTypes.bool,

      /**
       * How long (in milliseconds) to wait after the value has changed before
       * running validators.
       *
       * @type {Number}
       */
      validateOnChangeDelay: _react.PropTypes.number,

      /**
       * Handler to call when validation state changes.
       *
       * @type {Function}
       */
      onValidationChange: _react.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      validators: [],
      validateOnChange: true,
      validateOnChangeDelay: 500
    },
    enumerable: true
  }]);

  function InputWrapper() {
    _classCallCheck(this, InputWrapper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(InputWrapper.prototype), 'constructor', this).apply(this, args);
    this.state = {
      valid: null,
      validationMessage: null
    };
    this.onChangeTimeout = null;
    _events.EventEmitter.call(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.validate = this.validate.bind(this);
  }

  _createClass(InputWrapper, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var children = this.props.children;

      (0, _invariant2['default'])(children && children.props && children.props.name, 'A child component with a "name" property is required');

      if (children.type === 'input' && children.props.type === 'checkbox') {
        // Checkbox inputs must have a value attribute set:
        // https://www.w3.org/TR/html4/interact/forms.html#adef-value-INPUT
        (0, _invariant2['default'])(children.props && children.props.value, 'Inputs of type checkbox must have a value property');
      }

      this.props.manager.registerValidatedComponent(this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.manager.unregisterValidatedComponent(this);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (this.state.valid !== nextState.valid) {
        if (this.props.onValidationChange) {
          this.props.onValidationChange(this.state.valid, nextState.valid);
        }

        if (this.listenerCount('validationChange') > 0) {
          var _name = this.getName();
          this.emit('validationChange', _name, this.state.valid, nextState.valid);
        }
      }
    }
  }, {
    key: 'getName',
    value: function getName() {
      return this.props.children.props.name;
    }
  }, {
    key: 'getValidationState',
    value: function getValidationState() {
      return this.state.valid;
    }
  }, {
    key: 'getValidationStateMessage',
    value: function getValidationStateMessage() {
      return this.state.validationMessage;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
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
  }, {
    key: 'handleBlur',
    value: function handleBlur(event) {
      if (this.state.valid === null) {
        this.validate();
      }
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _this = this;

      var callback = arguments.length <= 0 || arguments[0] === undefined ? function (isValid, message) {} : arguments[0];

      // Clear timeout in case validate() was called while a change was queued.
      // This will prevent a potential double validation.
      if (this.props.validateOnChange) {
        clearTimeout(this.onChangeTimeout);
      }

      // TODO: Should this use `this.props.children.props.value`?
      var element = _reactDom2['default'].findDOMNode(this);
      var value = element.value;

      // Clear checkbox value when checkbox is not checked:
      if (element.type === 'checkbox' && element.checked === false) {
        value = '';
      }

      // Run through all validation routines...
      var validators = this.props.validators;

      var index = 0;

      // Valid until any validators fail:
      var isValid = true;
      var message = null;

      var next = function next() {
        if (isValid === false || !Boolean(validators[index])) {
          _this.setState({
            valid: isValid,
            validationMessage: message
          });
          callback(isValid, message);
          return;
        }

        validators[index](value, function (result) {
          index++;

          if (result !== true) {
            isValid = false;
            message = result;
          }

          next();
        });
      };

      next();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var handleChange = this.handleChange;
      var originalOnChange = this.props.children.props.onChange;

      if (originalOnChange) {
        handleChange = function (event) {
          originalOnChange(event);
          _this2.handleChange(event);
        };
      }

      var handleBlur = this.handleBlur;
      var originalOnBlur = this.props.children.props.onBlur;

      if (originalOnBlur) {
        handleBlur = function (event) {
          originalOnBlur(event);
          _this2.handleBlur(event);
        };
      }

      var element = _react2['default'].cloneElement(this.props.children, {
        onBlur: handleBlur,
        onChange: handleChange
      });
      return element;
    }
  }]);

  return InputWrapper;
})(_react.Component);

exports['default'] = InputWrapper;

Object.assign(InputWrapper.prototype, _events.EventEmitter.prototype);
module.exports = exports['default'];
