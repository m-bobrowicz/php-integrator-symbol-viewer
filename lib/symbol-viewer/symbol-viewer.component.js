'use babel';
'use strict';

import search from './search/search.component';
import selector from './selector/selector.component';

export default {
  props: ['items'],
  data() {
    return {
      criteria: {},
      selectedFigure: this.items ? this.items[0] : null,
    };
  },
  template: `
    <div>
      <selector v-bind:selectedFigure="selectedFigure"
                v-bind:options="items">
      </selector>
      <ul>
        <li v-for="item in items">
          {{item.name}}
        </li>
      </ul>
      <search v-on:searchQueryChange="mergeCriteria">
      </search>
    </div>
  `,
  methods: {
    mergeCriteria(updatedCriteria) {
      Object.assign(this.criteria, updatedCriteria);
    }
  },
  components: {
    'search': search,
    'selector': selector,
  },
};
