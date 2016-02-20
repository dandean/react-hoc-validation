import autobind from 'autobind-decorator';

export default class FormManager {
  // TODO: Use a 'name' based map for quicker lookup
  components = new Set([]);
  radios = {};

  state = {};

  registerValidatedRadioComponent(component) {
    const name = component.getName();

    if (!this.radios[name]) {
      this.radios[name] = new Set([]);
    }

    this.radios[name].add(component);
  }

  unregisterValidatedRadioComponent(component) {
    const name = component.getName();

    if (this.radios[name] && this.radios[name].has(component)) {
      this.radios[name].delete(component);
    }
  }

  registerValidatedComponent(component) {
    component.addListener('validationChange', this.handleValidationChange);
    this.components.add(component);
  }

  unregisterValidatedComponent(component) {
    component.removeListener('validationChange', this.handleValidationChange);
    this.components.delete(component);
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
    let component = null;
    this.components.forEach((current) => {
      if (current.getName() === name) {
        component = current;
      }
    });

    // TODO: it's gross that this looks into the component state:
    if (component) {
      return component.getValidationStateMessage();
    }
  }

  getIsAnyFieldInvalid() {
    let isValid = true;
    this.components.forEach((component) => {
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

    this.components.forEach((component) => {
      component.validate(done);
    });
  }
}
