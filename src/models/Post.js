export default class Post {
  constructor(data, btnText) {
    this.data = data;
    this.btnText = btnText;
  }

  createLink() {
    const a = document.createElement('a');
    a.href = this.data.link;
    a.className = 'fw-bold';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = this.data.title;

    return a;
  }

  createButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-primary btn-sm';
    button.textContent = this.btnText;

    return button;
  }

  render() {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';

    const link = this.createLink();
    const btn = this.createButton();
    li.append(link);
    li.append(btn);

    return li;
  }
}
