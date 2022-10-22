import i18next from 'i18next';
import * as yup from 'yup';

import yupLocale from './locales/yup';
import ru from './locales/ru';

import initForm from './views/form';
import initFeeds from './views/feeds';

import { getFeed, FEED_TIMEOUT } from './utils';

export default () => {
  const i18n = i18next.createInstance();
  yup.setLocale(yupLocale);

  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    const formElement = document.getElementById('rss-form');
    const formResultElement = document.getElementById('form-result');
    const modal = document.getElementById('modal');

    const formState = initForm(formElement, formResultElement);
    const feedsState = initFeeds(modal, i18n);

    const validateUrl = (rssUrl) => {
      const feeds = feedsState.feeds.map(({ url }) => url);
      const schema = yup.string().url().required().notOneOf(feeds);
      return schema.validate(rssUrl);
    };

    const updateFeedByTimeout = (url) => {
      setTimeout(() => {
        getFeed(url, i18n)
          .then((result) => {
            const index = feedsState.feeds.findIndex((item) => item.url === url);
            const { data } = feedsState.feeds[index];
            const filterItem = (item) => !data.items.find(({ link }) => link === item.link);
            const newItems = result.items.filter(filterItem());
            const updatedItems = [...newItems, ...feedsState.feeds[index].data.items];
            feedsState.feeds[index].data.items = updatedItems;
            updateFeedByTimeout(url);
          })
          .catch((err) => {
            console.error(err);
            updateFeedByTimeout(url);
          });
      }, FEED_TIMEOUT);
    };

    function handleFeedLoad(url, data) {
      feedsState.feeds.push({ url, data });

      updateFeedByTimeout(url);
    }

    const handleAddUrl = (url) => {
      getFeed(url, i18n)
        .then((result) => {
          handleFeedLoad(url, result);
          formState.success = i18n.t('success');
        })
        .catch((err) => {
          formState.rssUrlError = err;
        })
        .finally(() => {
          formState.isFetching = false;
        });
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      formState.isFetching = true;
      formState.rssUrlError = '';
      formState.success = '';

      const data = new FormData(e.target);
      const url = data.get('rss-url');
      validateUrl(url)
        .then(() => handleAddUrl(url))
        .catch((err) => {
          formState.rssUrlError = i18n.t(err.errors[0].key);
          formState.isFetching = false;
        });
    };

    const handleModalOpen = (event) => {
      feedsState.postClicked = event.relatedTarget;
    };

    formElement.addEventListener('submit', handleFormSubmit);
    modal.addEventListener('show.bs.modal', handleModalOpen);
  });
};
