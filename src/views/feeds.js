import onChange from 'on-change';

import { createBaseContent } from '../utils';
import { renderPost, renderFeed } from '../renders';

export default (modal, i18n) => {
  const initialState = {
    feeds: [],
    postClicked: null,
  };

  const postsData = {};
  const feedsData = {};

  const renderFeeds = (feeds) => {
    const ul = createBaseContent('feeds', i18n.t('feeds'));

    feeds.forEach(({ url }) => {
      ul.append(renderFeed(feedsData[url]));
    });
  };

  const renderPosts = (feeds) => {
    const ul = createBaseContent('posts', i18n.t('posts'));

    feeds.forEach(({ url }) => {
      feedsData[url].items.forEach((item) => {
        ul.append(renderPost(postsData[item.link], i18n.t('watch')));
      });
    });
  };

  const updateFeeds = (value, feed = null) => {
    const { url, data } = feed || value[value.length - 1];

    feedsData[url] = data;
    data.items.forEach((item) => {
      if (!postsData[item.link]) postsData[item.link] = { ...item, isRead: false };
    });

    const reversedFeeds = [...value].reverse();

    renderPosts(reversedFeeds);
    renderFeeds(reversedFeeds);
  };

  const handlePostClick = (button) => {
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
  };

  const handleUpdateFeed = (path, feeds) => {
    const index = +path.split('.')[1];
    const feed = feeds[index];

    updateFeeds(feeds, feed);
  };

  const state = onChange(initialState, (path, value) => {
    switch (true) {
      case path === 'feeds':
        updateFeeds(value);
        break;
      case path === 'postClicked':
        handlePostClick(value);
        break;
      case path.includes('data.items'):
        handleUpdateFeed(path, state.feeds);
        break;
      default:
        break;
    }
  });

  return state;
};
