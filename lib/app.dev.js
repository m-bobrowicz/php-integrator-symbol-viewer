'use babel';
'use strict';

import Vue from 'vue/dist/vue';
import symbolViewer from './symbol-viewer/symbol-viewer.component';
import sampleData from './sample-data';

new Vue({
  el: '#app',
  data: () => ({
    items: sampleData,
  }),
  template: `
    <symbol-viewer :items="items">
    </symbol-viewer>
  `,
  components: {
    'symbol-viewer': symbolViewer,
  },
});
