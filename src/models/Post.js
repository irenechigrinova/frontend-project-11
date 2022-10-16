import { createElement } from '../utils';

export default class Post {
  constructor(data, btnText) {
    this.data = data;
    this.btnText = btnText;
  }

  createLink() {
    return createElement('a', [
      { name: 'href', value: this.data.link },
      { name: 'class', value: this.data.isRead ? 'fw-normal' : 'fw-bold' },
      { name: 'target', value: '_blank' },
      { name: 'rel', value: 'noopener noreferrer' },
      { name: 'data-id', value: this.data.link },
    ], this.data.title);
  }

  createButton() {
    return createElement('button', [
      { name: 'type', value: 'button' },
      { name: 'class', value: 'btn btn-outline-primary btn-sm' },
      { name: 'data-bs-toggle', value: 'modal' },
      { name: 'data-bs-target', value: '#modal' },
      { name: 'data-bs-item', value: this.data.link },
    ], this.btnText);
  }

  render() {
    const li = createElement('li', [{
      name: 'class', value: 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0',
    }]);

    const link = this.createLink();
    const btn = this.createButton();
    li.append(link);
    li.append(btn);

    return li;
  }
}
