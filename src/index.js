import 'bootstrap';
import i18next from 'i18next';

import ru from './locales/ru';

import initForm from './controllers/form';
import renderFeeds from './controllers/feeds';
import renderPosts from './controllers/posts';

import { getFeed, FEED_TIMEOUT } from './utils';

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
  const postsData = {};

  const handleFeedLoad = (url, data, shouldUpdateFeed = true) => {
    feedUrls = [url, ...feedUrls];
    feedsData[url] = data;
    data.items.forEach((item) => {
      postsData[item.link] = item;
    });

    renderPosts(feedUrls, feedsData, i18n);
    if (shouldUpdateFeed) renderFeeds(feedUrls, feedsData, i18n);

    // eslint-disable-next-line no-use-before-define
    updateFeed(url);
  };

  function updateFeed(url) {
    setTimeout(() => {
      getFeed(url, i18n)
        .then((result) => {
          const newItems = result.items.filter((item) => !postsData[item.link]);
          handleFeedLoad(url, { ...result, items: [...newItems, ...result.items] }, false);
        })
        .catch((err) => {
          console.error(err);
          updateFeed(url);
        });
    }, FEED_TIMEOUT);
  }

  initForm(feedUrls, handleFeedLoad, i18n);
});
