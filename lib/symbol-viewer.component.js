'use babel';

require('reflect-metadata');

const { injectable, inject, unmanaged } = require('inversify');
const { Component } = require('react');
const h             = require('react-hyperscript');
const {
  div,
  span,
  button,
} = require('hyperscript-helpers')(h);

class SymbolViewerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    SymbolViewerComponent.store.subscribe(() => {
      this.setState(SymbolViewerComponent.store.getState());
    });

    console.log('SymbolViewerComponent', SymbolViewerComponent);
    console.log('SymbolViewerComponent.store', SymbolViewerComponent.store);
    console.log('SymbolViewerComponent.togglePanel', SymbolViewerComponent.togglePanel);
  }

  render() {
    return div([
      div({
        onClick: SymbolViewerComponent.togglePanel,
        className: 'toggle-button-container',
      }, [
        span({ className: 'toggle-button' }),
      ]),
      div({
        className: [
          'symbol-viewer',
          this.state.collapsed ? 'symbol-viewer--collapsed' : '',
        ].filter((c) => !!c).join(' ')
      }, [
        `Panel is ${ this.state.collapsed ? 'collapsed' : 'open' }`
      ]),
    ]);
  }
}

export default SymbolViewerComponent;
