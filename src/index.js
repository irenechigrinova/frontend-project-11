import 'bootstrap';
import i18next from 'i18next';
import onChange from 'on-change';

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
  const feedUrls = [];
  const feedsData = {};
  const postsData = {};
  let formState = {};

  const watchedFeeds = onChange(feedUrls, (_, value) => {
    const addedUrl = value[value.length - 1];
    getFeed(addedUrl, i18n)
      .then((result) => {
        handleFeedLoad(addedUrl, result);
        formState.success = i18n.t('success');
      })
      .catch((err) => {
        formState.rssUrlError = err;
      })
      .finally(() => {
        formState.isFetching = false;
      });
  });

  function handleFeedLoad(url, data) {
    feedsData[url] = data;
    data.items.forEach((item) => {
      if (!postsData[item.link]) postsData[item.link] = { ...item, isRead: false };
    });

    const reversedFeeds = [...watchedFeeds].reverse();

    renderPosts(reversedFeeds, feedsData, postsData, i18n);
    renderFeeds(reversedFeeds, feedsData, i18n);

    updateFeed(url);
  }

  function updateFeed(url) {
    setTimeout(() => {
      getFeed(url, i18n)
        .then((result) => {
          const newItems = result.items.filter((item) => !postsData[item.link]);
          handleFeedLoad(url, { ...result, items: [...newItems, ...result.items] });
        })
        .catch((err) => {
          console.error(err);
          updateFeed(url);
        });
    }, FEED_TIMEOUT);
  }

  const modal = document.getElementById('modal');
  modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const itemId = button.getAttribute('data-bs-item');
    postsData[itemId].isRead = true;

    const { title, desc } = postsData[itemId];
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-body');
    const read = modal.querySelector('.modal-footer a');
    const close = modal.querySelector('.modal-footer button');
    const link = document.querySelector(`[data-id="${itemId}"]`);

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    read.href = itemId;
    read.textContent = i18n.t('read');
    close.textContent = i18n.t('close');
    link.classList.add('fw-normal');
    link.classList.remove('fw-bold');
  });

  formState = initForm(watchedFeeds, i18n);
});
