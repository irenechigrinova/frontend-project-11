import 'bootstrap';
import i18next from 'i18next';

import ru from './locales/ru';

import initForm from './controllers/form';

import './app.scss';

const i18n = i18next.createInstance();

i18n.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
}).then(() => {
  const feeds = [];

  const handleFeedLoad = (url) => feeds.push(url);

  initForm(feeds, handleFeedLoad, i18n);
});
