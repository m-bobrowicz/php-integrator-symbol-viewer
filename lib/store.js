'use babel';

import { createStore } from 'redux';

export default createStore(function(state, action) {
    if (action.type === 'togglePanelCollapsed') {
      return { collapsed: !state.collapsed };
    }
    return state;
}, {
  collapsed: false,
});
