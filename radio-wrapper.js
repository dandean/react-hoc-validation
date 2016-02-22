'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

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

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _manager = require('./manager');

var _manager2 = _interopRequireDefault(_manager);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var RadioWrapper = (function (_Component) {
  _inherits(RadioWrapper, _Component);

  _createClass(RadioWrapper, null, [{
    key: 'propTypes',
    value: {
      children: _react.PropTypes.element.isRequired,
      manager: _react.PropTypes.instanceOf(_manager2['default']).isRequired
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
  }

  _createDecoratedClass(RadioWrapper, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var children = this.props.children;

      (0, _invariant2['default'])(children && children.props && children.props.name, 'A child component with a "name" property is required');

      if (children.type === 'input' && children.props.type === 'radio') {
        // Checkbox inputs must have a value attribute set:
        // https://www.w3.org/TR/html4/interact/forms.html#adef-value-INPUT
        (0, _invariant2['default'])(children.props && children.props.value, 'Inputs of type radio must have a value property');
      }

      this.props.manager.registerValidatedComponent(this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.manager.unregisterValidatedComponent(this);
    }
  }, {
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
  }, {
    key: 'handleChange',
    decorators: [_autobindDecorator2['default']],
    value: function handleChange(event) {
      this.emit('change', event);
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
