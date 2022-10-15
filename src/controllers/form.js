import onChange from 'on-change';
import * as yup from 'yup';

import yupLocale from '../locales/yup';
import { getFeed } from '../utils';

import Form from '../models/Form';

export default (feeds, onLoadFeed, i18n) => {
  yup.setLocale(yupLocale);

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
    const url = data.get('rss-url');
    validateUrl(url)
      .then(() => {
        getFeed(url, i18n)
          .then((result) => {
            onLoadFeed(url, result);
            formState.success = i18n.t('success');
          })
          .catch((err) => {
            formState.rssUrlError = err;
          })
          .finally(() => {
            formState.isFetching = false;
          });
      })
      .catch((err) => {
        formState.rssUrlError = i18n.t(err.errors[0].key);
        formState.isFetching = false;
      });
  };
  currentForm.subscribe('submit', handleFormSubmit);

  return { formState };
};
