import onChange from 'on-change';

import {
  handleChangeForm, handleFeeds, handlePosts, handleModal,
} from './utils/handlers';

export default (initState, elements, i18n) => onChange(initState, (path, value) => {
  switch (path) {
    case 'form':
      handleChangeForm(elements, value, i18n);
      break;
    case 'feeds':
      handleFeeds(elements, value, i18n);
      break;
    case 'posts':
      handlePosts(value, i18n);
      break;
    case 'clickedPostId':
      handleModal(value, initState.posts, elements.modal, i18n);
      break;
    default:
      break;
  }
});
