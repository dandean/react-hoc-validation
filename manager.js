'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _isValidating_ = Symbol();
var _components_ = Symbol();
var _state_ = Symbol();
var _timeout_ = Symbol();

/**
 * # FormValidationManager
 *
 * `FormValidationManager` is the central point of coordination between the
 * components in this module. When fields become valid or invalid,
 * `FormValidationManager` knows about it, and can give you validation messages
 * associated with invalid fields in a form.
 *
 * ```js
 * class Foo extends Component {
 *   componentWillMount() {
 *     this.manager = new FormValidationManager();
 *   }
 *
 *   render() {
 *     return (
 *       <FormWrapper manager={this.manager}>
 *         ...
 *       </FormWrapper>
 *     );
 *   }
 * }
 * ```
 */

var FormValidationManager = (function (_EventEmitter) {
  _inherits(FormValidationManager, _EventEmitter);

  function FormValidationManager() {
    _classCallCheck(this, FormValidationManager);

    _get(Object.getPrototypeOf(FormValidationManager.prototype), 'constructor', this).call(this);

    // Stores the *validation state* for all registered components. It's important
    // to note that this is not the form values, just whether the current values
    // are valid, invalid, or not yet validated.
    //
    // The value for each key will be:
    //
    // * `true`: component is valid
    // * `false`: component is invalid
    // * `null`: component is not yet validated
    this.validateOnChange = true;
    this.validateOnChangeDelay = 500;
    this.validateOnBlur = true;
    this[_state_] = {};

    this[_components_] = new Map([]);
    this[_isValidating_] = false;

    this.handleValidationChange = this.handleValidationChange.bind(this);
  }

  /**
   * ## Methods
   */

  //
  // GETTERS
  // ---------------------------------------------------------------------------

  /**
   * ### `getState([fieldName]) -> Boolean | null`
   *
   * Get the current validation state for the field `name="fieldName"`. Returns
   * `true`, `false`, or `null`.
   *
   * If `fieldName` is not given, the entire state object is returned.
   *
   * * `true`: valid
   * * `false`: invalid
   * * `null`: not yet validated
   */

  _createClass(FormValidationManager, [{
    key: 'getState',
    value: function getState(name) {
      if (!name) {
        return this[_state_];
      }

      var state = this[_state_][name];
      return state === undefined ? null : state;
    }

    /**
     * ### `getMessage(fieldName) -> String | undefined`
     *
     * Get the current validation message for the field `name="fieldName"`.
     */
  }, {
    key: 'getMessage',
    value: function getMessage(name) {
      var component = this[_components_].get(name);

      // Component might not yet be registered.
      if (component) {
        var message = component.getValidationStateMessage();
        return message;
      }
    }

    /**
     * ### `getIsAnyFieldInvalid() -> Boolean`
     *
     * If any field is currently invalid.
     */
  }, {
    key: 'getIsAnyFieldInvalid',
    value: function getIsAnyFieldInvalid() {
      var isValid = true;
      this[_components_].forEach(function (component, name) {
        if (isValid === true && component.getValidationState() === false) {
          isValid = false;
        }
      });

      return isValid === false;
    }

    /**
     * ### `getIsValidating() -> Boolean`
     *
     * If validation functions are currently executing.
     */
  }, {
    key: 'getIsValidating',
    value: function getIsValidating() {
      // If form is validating, return `true` early:
      if (this[_isValidating_] === true) {
        return true;
      }

      // Otherwise, we have to iterate all validation components until we either
      // find one or run out:

      var isValidating = false;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this[_components_].entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var _name = _step$value[0];
          var component = _step$value[1];

          if (component.getIsValidating() === true) {
            isValidating = true;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return isValidating;
    }

    //
    // VALIDATION INTEGRATION
    // ---------------------------------------------------------------------------

    // Register a component for validation. Components call this method within
    // their own `componentWillMount` method.
    //
    // @param {Component} component A higher order validation component
  }, {
    key: 'registerValidatedComponent',
    value: function registerValidatedComponent(component) {
      var name = component.getName();

      if (component.type === 'RadioWrapper') {
        // If component is a RadioWrapper, register it with the group with the
        // corresponding name:
        var group = this[_components_].get(name);
        if (group === undefined) {
          throw new Error('RadioWrapper requires a RadioGroup with the same name');
        }
        group.registerValidatedComponent(component);
      } else {
        // Listen for when the validation state changes and store a component ref:
        component.addListener('validationChange', this.handleValidationChange);
        this[_components_].set(component.getName(), component);
      }
    }

    // Unregister a component for validation. Components call this method within
    // their own `componentWillUnmount` method.
    //
    // @param {Component} component A higher order validation component
  }, {
    key: 'unregisterValidatedComponent',
    value: function unregisterValidatedComponent(component) {
      if (component.type === 'RadioWrapper') {
        var group = this[_components_].get(name);

        // RadioGroup will unmount before RadioWrapper if nested, so no need to
        // unregister if it's already gone:
        if (group) {
          group.unregisterValidatedComponent(component);
        }
      } else {
        component.removeListener('validationChange', this.handleValidationChange);
        this[_components_]['delete'](component.getName());
      }
    }

    // When the validation state changes (true, false, null) on a component.
    //
    // @param {String} name                The input's name attribute
    // @param {Boolean|null} previousState The previous state
    // @param {Boolean|null} nextState     The next state
  }, {
    key: 'handleValidationChange',
    value: function handleValidationChange(name, previousState, nextState) {
      var _this = this;

      this[_state_][name] = nextState;

      clearTimeout(this[_timeout_]);
      this[_timeout_] = setTimeout(function () {
        return _this.emit('change');
      }, 0);
    }

    /**
     * ### `validate([callback])`
     *
     * Called automatically when the form is submitted. Validates registered
     * fields. The callback is executed when all validators have completed.
     */
  }, {
    key: 'validate',
    value: function validate() {
      var _this2 = this;

      var callback = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

      this[_isValidating_] = true;

      var count = this[_components_].size;
      var completed = 0;

      var done = function done(result) {
        completed++;
        if (count === completed) {
          _this2[_isValidating_] = false;

          // Wait a tick to allow event emitter handlers to complete
          process.nextTick(callback);
        }
      };

      this[_components_].forEach(function (component, name) {
        component.validate(done);
      });
    }
  }]);

  return FormValidationManager;
})(_events.EventEmitter);

exports['default'] = FormValidationManager;
module.exports = exports['default'];
