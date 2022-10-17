import Feed from '../models/Feed';

import { createBaseContent } from '../utils';

export default (feeds, data, i18n) => {
  const ul = createBaseContent('feeds', i18n.t('feeds'));

  feeds.forEach((feed) => {
    const feedInstance = new Feed(data[feed]);
    const view = feedInstance.render();
    ul.append(view);
  });
};
