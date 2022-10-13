import 'bootstrap';

import initForm from './controllers/form';

import './app.scss';

const feeds = [];

const handleFeedLoad = (url) => feeds.push(url);

initForm(feeds, handleFeedLoad);
