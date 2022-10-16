import { createElement } from '../utils';

export default class Feed {
  constructor(data) {
    this.data = data;
  }

  createTitle() {
    return createElement('h6', [{
      name: 'class', value: 'h6 m-0',
    }], this.data.title);
  }

  createDesc() {
    return createElement('p', [
      { name: 'class', value: 'm-0 small text-black-50' },
    ], this.data.desc);
  }

  render() {
    const li = createElement('li', [{ name: 'class', value: 'list-group-item border-0 border-end-0' }]);

    const h6 = this.createTitle();
    const p = this.createDesc();
    li.append(h6);
    li.append(p);

    return li;
  }
}
