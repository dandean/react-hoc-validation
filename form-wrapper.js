'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _manager = require('./manager');

var _manager2 = _interopRequireDefault(_manager);

/**
 * # FormWrapper
 *
 * The `<FormWrapper>` component decorates a `<form>` element with default
 * validation properties and configuration.
 *
 * ```html
 * <FormWrapper manager={formValidationManager} onValidationChange={handleValidationChange}>
 *   <form>
 *     Your form controls in here
 *   </form>
 * </FormWrapper>
 * ```
 */

var FormWrapper = (function (_Component) {
  _inherits(FormWrapper, _Component);

  function FormWrapper() {
    _classCallCheck(this, FormWrapper);

    _get(Object.getPrototypeOf(FormWrapper.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FormWrapper, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        formValidationManager: this.props.manager
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      (0, _invariant2['default'])(this.props.children && this.props.children.type === 'form', 'FormWrapper can only wrap <form> elements');

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
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.manager.removeListener('change', this.handleValidationChange);
    }
  }, {
    key: 'handleValidationChange',
    value: function handleValidationChange() {
      if (this.props.onValidationChange) {
        this.props.onValidationChange();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var originalOnSubmit = this.props.children.props.onSubmit;
      var manager = this.props.manager;

      // When the wrapped form element submits, handle it...
      var form = _react2['default'].cloneElement(this.props.children, {
        // TODO: do not overwrite existing `onSubmit` function, wrap it:
        onSubmit: function onSubmit(event) {
          event.preventDefault();
          manager.validate(function () {
            if (originalOnSubmit && manager.getIsAnyFieldInvalid() === false) {
              originalOnSubmit(event);
            }
          });
        }
      });
      return form;
    }
  }], [{
    key: 'propTypes',

    /**
     * ## Properties
     *
     * The `manager` prop is required. Every other prop in documented in
     * [standard component props](./README.md#standard-component-props).
     */
    value: {
      children: _react.PropTypes.element.isRequired,

      /**
       * ### `manager={FormValidationManager}`
       *
       * The manager prop must be an instance of `FormValidationManager`. You must
       * create this instance yourself, probably in `componentWillMount`, and it
       * may not be used by more than one `<FormWrapper>`.
       */
      manager: _react.PropTypes.instanceOf(_manager2['default']).isRequired,

      validateOnChange: _react.PropTypes.bool,
      validateOnChangeDelay: _react.PropTypes.number,
      validateOnBlur: _react.PropTypes.bool,
      onValidationChange: _react.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      formValidationManager: _react.PropTypes.instanceOf(_manager2['default'])
    },
    enumerable: true
  }]);

  return FormWrapper;
})(_react.Component);

exports['default'] = FormWrapper;
module.exports = exports['default'];
