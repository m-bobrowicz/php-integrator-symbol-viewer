'use babel';

const ReactDOM              = require('react-dom');
const h                     = require('react-hyperscript');
const { createStore }       = require('redux');
const { Simulate, shallowRender }          = require('react-addons-test-utils');
const SymbolViewerComponent = require('../lib/symbol-viewer.component');

describe('symbolViewerComponent', function() {
  beforeEach(function() {
    this.container = document.createElement('atom-php-integrator-symbol-viewer');
  });

  it('should be collapsed by default', function() {
    ReactDOM.render(h(SymbolViewerComponent), this.container);
    const symbolViewer = this.container.querySelector('.symbol-viewer');

    expect(symbolViewer).toExist();
    expect(symbolViewer).not.toHaveClass('symbol-viewer--collapsed');
  })

  it('should toggle panel on button click', function() {
    ReactDOM.render(h(SymbolViewerComponent), this.container);
    const toggleButton = this.container.querySelector('.toggle-button-container');
    const symbolViewer = this.container.querySelector('.symbol-viewer');
    Simulate.click(toggleButton);    
    ReactDOM.render(h(SymbolViewerComponent), this.container);

    expect(symbolViewer).toExist();
    expect(symbolViewer).toHaveClass('symbol-viewer--collapsed');
  })
});
