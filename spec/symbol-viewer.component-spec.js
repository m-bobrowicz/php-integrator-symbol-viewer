'use babel';

const ReactDOM              = require('react-dom');
const h                     = require('react-hyperscript');
const { createStore }       = require('redux');
const { Simulate, shallowRender }          = require('react-addons-test-utils');
const SymbolViewerComponent = require('../lib/symbol-viewer.component');

describe('symbolViewerComponent', function() {
  beforeEach(function() {
    SymbolViewerComponent.store = createStore(function(state, action) {
      if (action.type === 'togglePanelCollapsed') {
        return { collapsed: !state.collapsed };
      }
      return state;
    }, {
      collapsed: false,
    });
    
    SymbolViewerComponent.togglePanel = function() {
      SymbolViewerComponent.store.dispatch({
        type: 'togglePanelCollapsed',
      });
    };

    this.container = document.createElement('atom-php-integrator-symbol-viewer');

    this.render = function() {
        ReactDOM.render(h(SymbolViewerComponent), this.container);
    };

    this.render();
  });

  it('should be collapsed by default', function() {
    const symbolViewer = this.container.querySelector('.symbol-viewer');

    expect(symbolViewer).toExist();
    expect(symbolViewer).not.toHaveClass('symbol-viewer--collapsed');
  })

  it('should toggle panel on button click', function() {
    const toggleButton = this.container.querySelector('.toggle-button-container');
    const symbolViewer = this.container.querySelector('.symbol-viewer');
    Simulate.click(toggleButton);
    this.render();

    expect(symbolViewer).toExist();
    expect(symbolViewer).toHaveClass('symbol-viewer--collapsed');
  })
});
