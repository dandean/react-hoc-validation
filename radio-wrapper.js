'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
 * # RadioWrapper
 *
 * The `<RadioWrapper>` component wraps `<input type="radio">` elements,
 * associating them with a `<RadioGroup>` component with the same name. The
 * `<RadioWrapper>` component has no props of its own; all validation
 * configuration is located on the parent `<RadioGroup>`.
 *
 * **See [`<RadioGroup>`](./radio-group.js) to learn more.**
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

var RadioWrapper = (function (_Component) {
  _inherits(RadioWrapper, _Component);

  _createClass(RadioWrapper, null, [{
    key: 'contextTypes',
    value: {
      formValidationManager: _react.PropTypes.instanceOf(_manager2['default']).isRequired
    },
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      children: _react.PropTypes.element.isRequired
    },
    enumerable: true
  }]);

  function RadioWrapper() {
    _classCallCheck(this, RadioWrapper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(RadioWrapper.prototype), 'constructor', this).apply(this, args);
    this.type = 'RadioWrapper';
    _events.EventEmitter.call(this);
    this.handleChange = this.handleChange.bind(this);
  }

  //
  // GETTERS
  // ---------------------------------------------------------------------------

  _createClass(RadioWrapper, [{
    key: 'getName',
    value: function getName() {
      return this.props.children.props.name;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.props.children.props.value;
    }
  }, {
    key: 'getIsChecked',
    value: function getIsChecked() {
      var element = _reactDom2['default'].findDOMNode(this);
      return element.checked;
    }

    //
    // VALIDATION INTEGRATION
    // ---------------------------------------------------------------------------

  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.emit('change', event);
    }

    //
    // REACT LIFECYCLE
    // ---------------------------------------------------------------------------

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var children = this.props.children;

      (0, _invariant2['default'])(children && children.props && children.props.name, 'A child component with a "name" property is required');

      if (children.type === 'input' && children.props.type === 'radio') {
        // Checkbox inputs must have a value attribute set:
        // https://www.w3.org/TR/html4/interact/forms.html#adef-value-INPUT
        (0, _invariant2['default'])(children.props && children.props.value, 'Inputs of type radio must have a value property');
      }

      this.context.formValidationManager.registerValidatedComponent(this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.context.formValidationManager.unregisterValidatedComponent(this);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var handleChange = this.handleChange;

      // Handler attached directly to the <input>:
      var originalOnChange = this.props.children.props.onChange;

      if (originalOnChange) {
        handleChange = function (event) {
          originalOnChange(event);
          _this.handleChange(event);
        };
      }

      var element = _react2['default'].cloneElement(this.props.children, {
        onChange: handleChange
      });
      return element;
    }
  }]);

  return RadioWrapper;
})(_react.Component);

exports['default'] = RadioWrapper;

Object.assign(RadioWrapper.prototype, _events.EventEmitter.prototype);
module.exports = exports['default'];
