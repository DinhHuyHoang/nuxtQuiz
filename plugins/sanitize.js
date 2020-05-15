import Vue from 'vue';
import sanitizeHtml from 'sanitize-html';

Vue.prototype.$sanitize = function (rawHtml) {
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedSchemesByTag: {
      img: ['data'],
    },
  });
};
