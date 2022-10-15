import Post from '../models/Post';
import { createBaseContent } from '../utils';

export default (feeds, data, i18n) => {
  const ul = createBaseContent('posts', i18n.t('posts'));

  feeds.forEach((feed) => {
    data[feed].items.forEach((item) => {
      const post = new Post(item, i18n.t('watch'));
      const content = post.render();
      ul.append(content);
    });
  });
};
