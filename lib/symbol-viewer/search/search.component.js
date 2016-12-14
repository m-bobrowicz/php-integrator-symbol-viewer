'use babel';
'use strict';

export default {
  data() {
    return {
      searchQuery: '',
    };
  },
  template: `
    <input type="text"
           v-model="searchQuery"
           v-on:keyup="$emit('searchQueryChange', {
             searchQuery
           })"/>
  `,
};
