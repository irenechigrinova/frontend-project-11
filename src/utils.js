import axios from 'axios';

export const FEED_PROXY = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
export const FEED_TIMEOUT = 5000;

export const toInputField = (str) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const parseRssData = (data, i18n) => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(data, 'text/xml');

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

export const parseRssResult = (data, i18n) => {
  if (!data || (data && data.status && data.status.http_code && data.status.http_code !== 200)) {
    throw new Error(i18n.t('invalidRss'));
  }

  return parseRssData(data.contents, i18n);
};

export const getFeed = (url, i18n) => new Promise((resolve, reject) => {
  axios.get(`${FEED_PROXY}${url}`)
    .then((response) => {
      const result = parseRssResult(response.data, i18n);
      resolve(result);
    })
    .catch((err) => {
      const errText = err.name && err.name === 'AxiosError' ? i18n.t('networkErr') : err.message;
      reject(errText);
    });
});

export const createElement = (el, attributes, text = null) => {
  const element = document.createElement(el);
  attributes.forEach(({ name, value }) => {
    element.setAttribute(name, value);
  });
  if (text) element.textContent = text;
  return element;
};
