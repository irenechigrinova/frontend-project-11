import { STATUS_CODES } from '../utils/consts';

const getFieldValue = (dom, selector) => {
  if (!dom.querySelector(selector)) {
    throw new Error(STATUS_CODES.invalidField);
  }
  return dom.querySelector(selector).textContent;
};

export default (data) => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(data, 'text/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) throw new Error(STATUS_CODES.invalidRss);

  const title = getFieldValue(dom, 'channel title');
  const desc = getFieldValue(dom, 'channel description');
  const items = Array.from(dom.querySelectorAll('item')).map((item) => ({
    title: getFieldValue(item, 'title'),
    desc: getFieldValue(item, 'description'),
    link: getFieldValue(item, 'link'),
  }));

  return { title, desc, items };
};
