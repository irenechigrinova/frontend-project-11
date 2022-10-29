import { STATUS_CODES } from './consts';
import { createBaseContent, createElement } from './helpers';

export const handleChangeForm = (elements, state, i18n) => {
  const input = elements.form.querySelector('input');
  const button = elements.form.querySelector('button');

  const setResultClasses = (addClass, removeClass, fieldIsValid) => {
    elements.result.classList.remove(removeClass);
    elements.result.classList.add(addClass);

    const method = fieldIsValid ? 'remove' : 'add';
    input.classList[method]('is-invalid');
  };

  const resetForm = () => {
    elements.form.reset();
    elements.form.querySelector('input').focus();
  };

  if (state.error) {
    elements.result.innerHTML = i18n.t(state.error);
  }

  button.removeAttribute('disabled');

  switch (state.status) {
    case STATUS_CODES.failed:
      setResultClasses('text-danger', 'text-success', false);
      break;
    case STATUS_CODES.success:
      setResultClasses('text-success', 'text-danger', true);
      elements.result.innerHTML = i18n.t(STATUS_CODES.success);
      resetForm();
      break;
    case STATUS_CODES.focus:
      resetForm();
      break;
    case STATUS_CODES.fetching:
      button.setAttribute('disabled', 'true');
      break;
    default:
      break;
  }
};

export const handleFeeds = (elements, feeds, i18n) => {
  const createTitle = (title) => createElement('h6', [{
    name: 'class', value: 'h6 m-0',
  }], title);

  const createDesc = (desc) => createElement('p', [
    { name: 'class', value: 'm-0 small text-black-50' },
  ], desc);

  const renderFeed = (feed) => {
    const li = createElement('li', [{ name: 'class', value: 'list-group-item border-0 border-end-0' }]);

    const h6 = createTitle(feed.title);
    const p = createDesc(feed.desc);
    li.append(h6);
    li.append(p);

    return li;
  };

  const ul = createBaseContent('feeds', i18n.t('feeds'));

  [...feeds].reverse().forEach((feed) => {
    ul.append(renderFeed(feed));
  });
};

export const handlePosts = (elements, data, i18n) => {
  const createLink = (post) => createElement('a', [
    { name: 'href', value: post.link },
    { name: 'class', value: post.isRead ? 'fw-normal' : 'fw-bold' },
    { name: 'target', value: '_blank' },
    { name: 'rel', value: 'noopener noreferrer' },
    { name: 'data-id', value: post.link },
  ], post.title);

  const createButton = (link, text) => createElement('button', [
    { name: 'type', value: 'button' },
    { name: 'class', value: 'btn btn-outline-primary btn-sm' },
    { name: 'data-bs-toggle', value: 'modal' },
    { name: 'data-bs-target', value: '#modal' },
    { name: 'data-bs-item', value: link },
  ], text);

  const renderPost = (post) => {
    const li = createElement('li', [{
      name: 'class', value: 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0',
    }]);

    const link = createLink(post);
    const btn = createButton(post.link, i18n.t('watch'));
    li.append(link);
    li.append(btn);

    return li;
  };

  const ul = createBaseContent('posts', i18n.t('posts'));

  [...data.feeds].reverse().forEach(({ postIds }) => {
    postIds.forEach((id) => {
      ul.append(renderPost(data.posts[id]));
    });
  });
};

export const handleModal = (itemId, posts, modal, i18n) => {
  posts[itemId].isRead = true;

  const { title, desc } = posts[itemId];
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
