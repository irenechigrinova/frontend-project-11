import Post from '../models/Post';
import { createBaseContent } from '../utils';

export default (feeds, feedData, postData, i18n) => {
  const ul = createBaseContent('posts', i18n.t('posts'));

  feeds.forEach((feed) => {
    feedData[feed].items.forEach((item) => {
      const post = new Post(postData[item.link], i18n.t('watch'));
      const content = post.render();
      ul.append(content);
    });
  });
};
