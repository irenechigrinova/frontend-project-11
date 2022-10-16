import { toInputField } from '../utils';

export default class Form {
  constructor(element, resultElement, onChange) {
    this.element = element;
    this.onChange = onChange;
    this.resultElement = resultElement;
  }

  subscribe(action, callback) {
    this.element.addEventListener(action, callback);
  }

  unsubscribe(action, callback) {
    this.element.removeEventListener(action, callback);
  }

  setResultClasses(addClass, removeClass, field, fieldIsValid) {
    this.resultElement.classList.remove(removeClass);
    this.resultElement.classList.add(addClass);
    if (field) {
      const method = fieldIsValid ? 'remove' : 'add';
      this.element.querySelector(`#${field}`).classList[method]('is-invalid');
    }
  }

  setResult(message, type, field = null) {
    this.resultElement.innerHTML = message;
    if (type === 'error' && message.length) {
      this.setResultClasses('text-danger', 'text-success', field, false);
    } else if (type === 'success' || !message.length) {
      this.setResultClasses('text-success', 'text-danger', field, true);
    }
  }

  resetForm() {
    this.element.reset();
    this.element.querySelector('input').focus();
  }

  toggleButton(value) {
    if (value) {
      this.element.querySelector('button').setAttribute('disabled', true);
    } else {
      this.element.querySelector('button').removeAttribute('disabled');
    }
  }

  init(state) {
    return this.onChange(state, (path, value) => {
      switch (true) {
        case path.includes('Error'):
          this.setResult(value, 'error', toInputField(path.replace(/Error/g, '')));
          break;
        case path === 'success' && value.length > 0:
          this.resetForm();
          this.setResult(value, 'success');
          break;
        case path === 'isFetching':
          this.toggleButton(value);
          break;
        default:
          break;
      }
    });
  }
}
