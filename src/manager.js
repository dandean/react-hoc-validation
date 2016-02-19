import autobind from 'autobind-decorator';

export default class FormManager {
  // TODO: Use a 'name' based map for quicker lookup
  components = new Set([]);

  state = {};

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
      if (current.props.children.props.name === name) {
        component = current;
      }
    });

    // TODO: it's gross that this looks into the component state:
    if (component) {
      return component.state.validationMessage;
    }
  }

  getIsAnyFieldInvalid() {
    let isValid = true;
    this.components.forEach((component) => {
      if (isValid === true && component.state.valid === false) {
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
