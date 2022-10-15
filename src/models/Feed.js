export default class Feed {
  constructor(data) {
    this.data = data;
  }

  createTitle() {
    const h6 = document.createElement('h6');
    h6.className = 'h6 m-0';
    h6.textContent = this.data.title;
    return h6;
  }

  createDesc() {
    const p = document.createElement('p');
    p.className = 'm-0 small text-black-50';
    p.textContent = this.data.desc;
    return p;
  }

  render() {
    const li = document.createElement('li');
    li.className = 'list-group-item border-0 border-end-0';

    const h6 = this.createTitle();
    const p = this.createDesc();
    li.append(h6);
    li.append(p);

    return li;
  }
}
