import onChange from 'on-change';

import { toInputField } from '../utils';

export default (formElement, resultElement) => {
  const initialFormState = {
    isFetching: false,
    rssUrlError: '',
    success: '',
  };

  const setResultClasses = (addClass, removeClass, field, fieldIsValid) => {
    resultElement.classList.remove(removeClass);
    resultElement.classList.add(addClass);
    if (field) {
      const method = fieldIsValid ? 'remove' : 'add';
      formElement.querySelector(`#${field}`).classList[method]('is-invalid');
    }
  };

  const setResult = (message, type, field = null) => {
    resultElement.innerHTML = message;
    if (type === 'error' && message.length) {
      setResultClasses('text-danger', 'text-success', field, false);
    } else if (type === 'success' || !message.length) {
      setResultClasses('text-success', 'text-danger', field, true);
    }
  };

  const resetForm = () => {
    formElement.reset();
    formElement.querySelector('input').focus();
  };

  const toggleButton = (value) => {
    if (value) {
      formElement.querySelector('button').setAttribute('disabled', 'true');
    } else {
      formElement.querySelector('button').removeAttribute('disabled');
    }
  };

  return onChange(initialFormState, (path, value) => {
    switch (true) {
      case path.includes('Error'):
        setResult(value, 'error', toInputField(path.replace(/Error/g, '')));
        break;
      case path === 'success' && value.length > 0:
        resetForm();
        setResult(value, 'success');
        break;
      case path === 'isFetching':
        toggleButton(value);
        break;
      default:
        break;
    }
  });
};
