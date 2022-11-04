import i18next from 'i18next';
import * as yup from 'yup';

import yupLocale from './locales/yup';
import ru from './locales/ru';

import { getFeed } from './utils/helpers';
import { FEED_TIMEOUT, STATUS_CODES } from './utils/consts';

import observe from './observer';

export default () => {
  const i18n = i18next.createInstance();
  yup.setLocale(yupLocale);

  const initState = {
    feeds: [],
    posts: [],
    form: {
      error: null,
      status: STATUS_CODES.focus,
    },
    clickedPostId: null,
  };

  const elements = {
    form: document.getElementById('rss-form'),
    result: document.getElementById('form-result'),
    modal: document.getElementById('modal'),
    input: document.getElementById('rss-form').querySelector('input'),
    button: document.getElementById('rss-form').querySelector('button'),
  };

  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    const state = observe(initState, elements, i18n);

    const validateUrl = (rssUrl) => {
      const feeds = state.feeds.map(({ url }) => url);
      const schema = yup.string().url().required().notOneOf(feeds);
      return schema.validate(rssUrl);
    };

    const updateFeedsByTimeout = () => {
      setTimeout(() => {
        const promises = [...state.feeds].reverse().map((feed) => getFeed(feed.url, i18n));
        Promise.allSettled(promises)
          .then((results) => {
            const posts = [];
            results.forEach((result) => {
              if (result.status === 'fulfilled') {
                result.value.items.forEach((item) => {
                  const postExists = state.posts.find((post) => post.link === item.link);
                  if (!postExists) {
                    posts.push({ ...item, isRead: false, feedId: result.value.url });
                  }
                });
              }
            });
            state.posts = [...posts, ...state.posts];
            updateFeedsByTimeout();
          });
      }, FEED_TIMEOUT);
    };

    const handleFeedLoad = (url, data) => {
      const posts = data.items.map((post) => ({ ...post, feedId: url, isRead: false }));
      state.feeds.push({
        url, title: data.title, desc: data.desc,
      });
      state.posts = [...posts, ...state.posts];
    };

    const loadFeed = (url) => {
      getFeed(url, i18n)
        .then((result) => {
          state.form = {
            ...state.form,
            error: result.error ? result.message : null,
            status: result.error ? STATUS_CODES.failed : STATUS_CODES.success,
          };
          if (!result.error) {
            handleFeedLoad(url, result);
          }
        });
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();

      state.form = {
        ...state.form,
        status: STATUS_CODES.fetching,
        error: null,
      };

      const data = new FormData(e.target);
      const url = data.get('rss-url');
      validateUrl(url)
        .then(() => {
          state.form = {
            ...state.form,
            error: null,
          };
          loadFeed(url);
        })
        .catch((err) => {
          state.form = {
            ...state.form,
            error: err.errors[0].key,
            status: STATUS_CODES.failed,
          };
        });
    };

    const handleModalOpen = (event) => {
      const id = event.relatedTarget.getAttribute('data-bs-item');
      state.clickedPostId = id;
      state.posts = state.posts.map((post) => {
        if (post.link === id) {
          return { ...post, isRead: true };
        }
        return post;
      });
    };

    elements.form.addEventListener('submit', handleFormSubmit);
    elements.modal.addEventListener('show.bs.modal', handleModalOpen);

    updateFeedsByTimeout();
  });
};
