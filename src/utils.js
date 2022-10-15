export const toInputField = (str) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const parseRssData = (data, i18n) => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(data, 'application/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) throw new Error(i18n.t('invalidRss'));

  const title = dom.querySelector('channel title')?.textContent || '';
  const desc = dom.querySelector('channel description')?.textContent || '';
  const items = Array.from(dom.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title')?.textContent || '',
    desc: item.querySelector('description')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
  }));

  return { title, desc, items };
};

export const FEED_PROXY = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

export const createBaseContent = (id, text) => {
  const container = document.querySelector(`#${id}`);
  container.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card border-0';
  const div = document.createElement('div');
  div.className = 'card-body';
  const h4 = document.createElement('h4');
  h4.className = 'h4 card-title';
  h4.textContent = text;
  div.append(h4);
  card.append(div);
  container.append(card);

  const ul = document.createElement('ul');
  ul.className = 'list-group border-0 rounded-0';
  container.append(ul);

  return ul;
};
