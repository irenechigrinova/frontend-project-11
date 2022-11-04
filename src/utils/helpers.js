import axios from 'axios';

import parseData from '../parsers';
import { PARSE_FORMATS, STATUS_CODES, FEED_PROXY } from './consts';

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

export const getFeed = (url) => axios.get(`${FEED_PROXY}${url}`)
  .then((response) => {
    const { data } = response;
    if (!data || (data && data.status && data.status.http_code && data.status.http_code !== 200)) {
      throw new Error(STATUS_CODES.invalidRss);
    }
    return parseData(data.contents, PARSE_FORMATS.xml);
  })
  .catch((err) => ({ error: true, message: (err.name && err.name === 'AxiosError' ? STATUS_CODES.networkErr : err.message) }));

export const createElement = (el, attributes, text = null) => {
  const element = document.createElement(el);
  attributes.forEach(({ name, value }) => {
    element.setAttribute(name, value);
  });
  if (text) element.textContent = text;
  return element;
};
