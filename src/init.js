import i18next from 'i18next';
import * as yup from 'yup';

import yupLocale from './locales/yup';
import ru from './locales/ru';

import { getFeed, transformPosts } from './utils/helpers';
import { FEED_TIMEOUT, STATUS_CODES } from './utils/consts';

import observe from './observer';

export default () => {
  const i18n = i18next.createInstance();
  yup.setLocale(yupLocale);

  const initState = {
    feeds: [],
    posts: {},
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

    const updateFeedByTimeout = (url) => {
      setTimeout(() => {
        getFeed(url, i18n)
          .then((result) => {
            const newPosts = result.items.filter(({ link }) => !state.posts[link]);
            const { posts: newPostsData, postIds } = transformPosts(newPosts);
            state.feeds = state.feeds.map((feed) => {
              if (feed.url === url) {
                return { ...feed, postIds: [...postIds, ...feed.postIds] };
              }
              return feed;
            });
            state.posts = {
              ...state.posts,
              ...newPostsData,
            };
            updateFeedByTimeout(url);
          })
          .catch((err) => {
            console.error(err);
            updateFeedByTimeout(url);
          });
      }, FEED_TIMEOUT);
    };

    const handleFeedLoad = (url, data) => {
      const { posts, postIds } = transformPosts(data.items);
      state.feeds.push({
        url, title: data.title, desc: data.desc, postIds,
      });
      state.posts = { ...state.posts, ...posts };

      updateFeedByTimeout(url);
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
      state.clickedPostId = event.relatedTarget.getAttribute('data-bs-item');
    };

    elements.form.addEventListener('submit', handleFormSubmit);
    elements.modal.addEventListener('show.bs.modal', handleModalOpen);
  });
};
