import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';

import yupLocale from '../locales/yup';
import { FEED_PROXY, parseRssData } from '../utils';

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
  const parseResult = (data) => {
    if (!!data.status.http_code && data.status.http_code !== 200) {
      throw new Error(i18n.t('invalidRss'));
    }

    return parseRssData(data.contents, i18n);
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
        axios.get(`${FEED_PROXY}${url}`)
          .then((response) => {
            const result = parseResult(response.data);
            onLoadFeed(url, result);
            formState.success = i18n.t('success');
          })
          .catch((err) => {
            formState.rssUrlError = err.message;
          });
      })
      .catch((err) => {
        formState.rssUrlError = i18n.t(err.errors[0].key);
      })
      .finally(() => {
        formState.isFetching = false;
      });
  };
  currentForm.subscribe('submit', handleFormSubmit);

  return { formState };
};
