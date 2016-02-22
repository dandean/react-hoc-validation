'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var FormManager = (function () {
  function FormManager() {
    _classCallCheck(this, FormManager);

    this.components = new Map([]);
    this.state = {};
  }

  _createDecoratedClass(FormManager, [{
    key: 'registerValidatedComponent',
    value: function registerValidatedComponent(component) {
      var name = component.getName();

      if (component.type === 'RadioWrapper') {
        var group = this.components.get(name);
        if (group === undefined) {
          throw new Error('RadioWrapper requires a RadioGroup with the same name');
        }
        group.registerValidatedComponent(component);
      } else {
        component.addListener('validationChange', this.handleValidationChange);
        this.components.set(component.getName(), component);
      }
    }
  }, {
    key: 'unregisterValidatedComponent',
    value: function unregisterValidatedComponent(component) {
      if (component.type === 'RadioWrapper') {
        var group = this.components.get(name);

        // RadioGroup will unmount before RadioWrapper if nested, so no need to
        // unregister if it's already gone:
        if (group) {
          group.unregisterValidatedComponent(component);
        }
      } else {
        component.removeListener('validationChange', this.handleValidationChange);
        this.components['delete'](component.getName());
      }
    }
  }, {
    key: 'handleValidationChange',
    decorators: [_autobindDecorator2['default']],
    value: function handleValidationChange(name, previousState, nextState) {
      this.state[name] = nextState;
    }
  }, {
    key: 'getFieldValidationState',
    value: function getFieldValidationState(name) {
      var state = this.state[name];
      return state === undefined ? null : state;
    }
  }, {
    key: 'getFieldValidationMessage',
    value: function getFieldValidationMessage(name) {
      var component = this.components.get(name);
      if (component) {
        return component.getValidationStateMessage();
      }
    }
  }, {
    key: 'getIsAnyFieldInvalid',
    value: function getIsAnyFieldInvalid() {
      var isValid = true;
      this.components.forEach(function (component, name) {
        if (isValid === true && component.getValidationState() === false) {
          isValid = false;
        }
      });

      return isValid === false;
    }
  }, {
    key: 'validate',
    value: function validate() {
      var callback = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

      var count = this.components.size;
      var completed = 0;

      var done = function done(result) {
        completed++;
        if (count === completed) {
          // Wait a tick to allow event emitter handlers to complete
          process.nextTick(callback);
        }
      };

      this.components.forEach(function (component, name) {
        component.validate(done);
      });
    }
  }]);

  return FormManager;
})();

exports['default'] = FormManager;
module.exports = exports['default'];
