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

/**
 * # RadioGroup
 *
 * The `<RadioGroup>` component decorates a group of `<input type="radio">`,
 * elements with validation properties and configuration. Each radio input
 * must be wrapped in a `<RadioWrapper>` in order for the `<RadioGroup>` to know
 * about them.
 *
 * ```html
 * <RadioGroup name="foo" validators={[fn]}>
 *   <div>
 *     <RadioWrapper>
 *       <input type="radio" name="foo" value="1" />
 *     </RadioWrapper>
 *     <RadioWrapper>
 *       <input type="radio" name="foo" value="2" />
 *     </RadioWrapper>
 *   </div>
 * </RadioGroup>
 * ```
 */

var RadioGroup = (function (_Component) {
  _inherits(RadioGroup, _Component);

  _createClass(RadioGroup, null, [{
    key: 'contextTypes',
    value: {
      formValidationManager: _react.PropTypes.instanceOf(_manager2['default']).isRequired
    },

    /**
     * ## Props
     *
     * All props are documented in [standard component props](./README.md#standard-component-props),
     * with the exception of `validateOnBlur`, which does not apply to
     * `<RadioGroup>`.
     */
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      name: _react.PropTypes.string.isRequired,
      validators: _react.PropTypes.arrayOf(_react.PropTypes.func),

      validateOnChange: _react.PropTypes.bool,
      validateOnChangeDelay: _react.PropTypes.number,

      onValidationChange: _react.PropTypes.func
    },
    enumerable: true
  }]);

  function RadioGroup() {
    _classCallCheck(this, RadioGroup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(RadioGroup.prototype), 'constructor', this).apply(this, args);
    this.state = {
      valid: null,
      validationMessage: null,
      isValidating: false
    };
    this.radios = new Set([]);
    this.onChangeTimeout = null;
    this.validateOnChange = null;
    this.validateOnChangeDelay = null;
    _events.EventEmitter.call(this);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  //
  // GETTERS
  // ---------------------------------------------------------------------------

  _createClass(RadioGroup, [{
    key: 'getName',
    value: function getName() {
      return this.props.name;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      var value = null;

      this.radios.forEach(function (radio) {
        if (value === null && radio.getIsChecked()) {
          value = radio.getValue();
        }
      });

      return value;
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
    key: 'getIsValidating',
    value: function getIsValidating() {
      return this.state.isValidating;
    }

    //
    // VALIDATION INTEGRATION
    // ---------------------------------------------------------------------------

  }, {
    key: 'registerValidatedComponent',
    value: function registerValidatedComponent(radio) {
      radio.addListener('change', this.handleChange);
      this.radios.add(radio);
    }
  }, {
    key: 'unregisterValidatedComponent',
    value: function unregisterValidatedComponent(radio) {
      if (radio) {
        radio.removeListener('change', this.handleChange);
        this.radios['delete'](radio);
      }
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

      if (this.validateOnChange) {
        this.onChangeTimeout = setTimeout(this.validate, this.validateOnChangeDelay);
      }
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _this = this;

      var callback = arguments.length <= 0 || arguments[0] === undefined ? function (isValid, message) {} : arguments[0];

      // Clear timeout in case validate() was called while a change was queued.
      // This will prevent a potential double validation.
      if (this.validateOnChange) {
        clearTimeout(this.onChangeTimeout);
      }

      this.setState({ isValidating: true });

      var value = this.getValue();

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
            validationMessage: message,
            isValidating: false
          });
          callback(isValid, message);
          return;
        }

        validators[index](value, function (result) {
          index++;

          if (Boolean(result)) {
            isValid = false;
            message = result;
          }

          next();
        });
      };

      next();
    }

    //
    // REACT LIFECYCLE
    // ---------------------------------------------------------------------------

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var manager = this.context.formValidationManager;
      manager.registerValidatedComponent(this);

      this.validateOnChange = this.props.validateOnChange || manager.validateOnChange;

      if (this.props.validateOnChangeDelay !== undefined) {
        this.validateOnChangeDelay = this.props.validateOnChangeDelay;
      } else {
        this.validateOnChangeDelay = manager.validateOnChangeDelay;
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this2 = this;

      this.radios.forEach(function (radio) {
        _this2.unregisterValidatedComponent(radio);
      });
      this.context.formValidationManager.unregisterValidatedComponent(this);
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
    key: 'render',
    value: function render() {
      return this.props.children || _react2['default'].createElement('noscript', null);
    }
  }]);

  return RadioGroup;
})(_react.Component);

exports['default'] = RadioGroup;

Object.assign(RadioGroup.prototype, _events.EventEmitter.prototype);
module.exports = exports['default'];
