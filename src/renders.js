import { createElement } from './utils';

export const renderFeed = (data) => {
  const createTitle = () => createElement('h6', [{
    name: 'class', value: 'h6 m-0',
  }], data.title);

  const createDesc = () => createElement('p', [
    { name: 'class', value: 'm-0 small text-black-50' },
  ], data.desc);

  const render = () => {
    const li = createElement('li', [{ name: 'class', value: 'list-group-item border-0 border-end-0' }]);

    const h6 = createTitle();
    const p = createDesc();
    li.append(h6);
    li.append(p);

    return li;
  };

  return render();
};

export const renderPost = (data, btnText) => {
  const createLink = () => createElement('a', [
    { name: 'href', value: data.link },
    { name: 'class', value: data.isRead ? 'fw-normal' : 'fw-bold' },
    { name: 'target', value: '_blank' },
    { name: 'rel', value: 'noopener noreferrer' },
    { name: 'data-id', value: data.link },
  ], data.title);

  const createButton = () => createElement('button', [
    { name: 'type', value: 'button' },
    { name: 'class', value: 'btn btn-outline-primary btn-sm' },
    { name: 'data-bs-toggle', value: 'modal' },
    { name: 'data-bs-target', value: '#modal' },
    { name: 'data-bs-item', value: data.link },
  ], btnText);

  const render = () => {
    const li = createElement('li', [{
      name: 'class', value: 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0',
    }]);

    const link = createLink();
    const btn = createButton();
    li.append(link);
    li.append(btn);

    return li;
  };

  return render();
};
