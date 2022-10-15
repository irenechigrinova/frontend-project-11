import 'bootstrap';
import i18next from 'i18next';

import ru from './locales/ru';

import initForm from './controllers/form';
import renderFeeds from './controllers/feeds';
import renderPosts from './controllers/posts';

import './app.scss';

const i18n = i18next.createInstance();

i18n.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
}).then(() => {
  let feedUrls = [];
  const feedsData = {};

  const handleFeedLoad = (url, data) => {
    feedUrls = [url, ...feedUrls];
    feedsData[url] = data;

    renderFeeds(feedUrls, feedsData, i18n);
    renderPosts(feedUrls, feedsData, i18n);
  };

  initForm(feedUrls, handleFeedLoad, i18n);
});
