import autobind from 'autobind-decorator';
import invariant from 'invariant';

export default class FormManager {
  components = new Map([]);
  state = {};

  registerValidatedComponent(component) {
    const name = component.getName();

    if (component.type === 'RadioWrapper') {
      const group = this.components.get(name);
      if (group === undefined) {
        throw new Error('RadioWrapper requires a RadioGroup with the same name')
      }
      group.registerValidatedComponent(component);

    } else {
      component.addListener('validationChange', this.handleValidationChange);
      this.components.set(component.getName(), component);
    }
  }

  unregisterValidatedComponent(component) {
    if (component.type === 'RadioWrapper') {
      const group = this.components.get(name);

      // RadioGroup will unmount before RadioWrapper if nested, so no need to
      // unregister if it's already gone:
      if (group) {
        group.unregisterValidatedComponent(component);
      }

    } else {
      component.removeListener('validationChange', this.handleValidationChange);
      this.components.delete(component.getName());
    }
  }

  @autobind
  handleValidationChange(name, previousState, nextState) {
    this.state[name] = nextState;
  }

  getFieldValidationState(name) {
    const state = this.state[name];
    return state === undefined ? null : state ;
  }

  getFieldValidationMessage(name) {
    const component = this.components.get(name);
    if (component) {
      return component.getValidationStateMessage();
    }
  }

  getIsAnyFieldInvalid() {
    let isValid = true;
    this.components.forEach((component, name) => {
      if (isValid === true && component.getValidationState() === false) {
        isValid = false;
      }
    });

    return isValid === false;
  }

  validate(callback = ()=>{}) {
    const count = this.components.size;
    let completed = 0;

    const done = (result) => {
      completed++;
      if (count === completed) {
        // Wait a tick to allow event emitter handlers to complete
        process.nextTick(callback);
      }
    }

    this.components.forEach((component, name) => {
      component.validate(done);
    });
  }
}
