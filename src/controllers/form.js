import onChange from 'on-change';
import * as yup from 'yup';
import Form from '../models/Form';

export default (feeds, onLoadFeed) => {
  const initialFormState = {
    isFetching: false,
    rssUrlError: '',
    success: '',
  };
  const formElement = document.getElementById('rss-form');
  const formResultElement = document.getElementById('form-result');

  const currentForm = new Form(formElement, formResultElement, onChange);
  const formState = currentForm.init(initialFormState);

  const validateUrl = (url) => {
    const schema = yup.string().url().required().notOneOf(feeds);
    return schema.validate(url);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    formState.isFetching = true;
    formState.rssUrlError = '';
    formState.success = '';

    const data = new FormData(e.target);
    validateUrl(data.get('rss-url'))
      .then(() => {
        onLoadFeed(data.get('rss-url'));
      })
      .catch((err) => {
        formState.rssUrlError = err.message;
      })
      .finally(() => {
        formState.isFetching = false;
      });
  };
  currentForm.subscribe('submit', handleFormSubmit);

  return { formState };
};
