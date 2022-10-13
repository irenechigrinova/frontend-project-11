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

  setResult(message, type, field) {
    this.resultElement.innerHTML = message;
    if (type === 'error' && message.length) {
      this.resultElement.classList.remove('text-success');
      this.resultElement.classList.add('text-danger');
      this.element.querySelector(`#${field}`).classList.add('is-invalid');
    } else if (type === 'success' || !message.length) {
      this.resultElement.classList.add('text-success');
      this.resultElement.classList.remove('text-danger');
      this.element.querySelector(`#${field}`).classList.remove('is-invalid');
    }
  }

  init(state) {
    return this.onChange(state, (path, value) => {
      switch (true) {
        case path.includes('Error'):
          this.setResult(value, 'error', toInputField(path.replace(/Error/g, '')));
          break;
        default:
          break;
      }
    });
  }
}
