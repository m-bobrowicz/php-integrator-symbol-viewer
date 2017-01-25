'use babel';

export default function togglePanelCollapsed() {
  togglePanelCollapsed.store.dispatch({
    type: 'togglePanelCollapsed',
  });
}
