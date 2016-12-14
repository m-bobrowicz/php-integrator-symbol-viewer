'use babel';
'use strict';

export default {
  props: ['options', 'selectedFigure'],
  template: `
    <select v-model="selectedFigure">
      <option v-for="option in options">
        {{option.name}}
      </option>
    </select>
  `,
};
