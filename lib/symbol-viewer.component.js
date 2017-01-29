'use babel';

import { Component } from 'react';
import h from 'react-hyperscript';
import {
  div,
  span,
  input,
  label
} from './hyperscript';

export default class SymbolViewerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.store.subscribe((state) => {
      this.setState(this.store.getState());
    });
  }

  render() {
    return div({ className: this.generalCollapsedClass() }, [
      div({
        onClick: this.togglePanel,
        className: 'symbol-viewer__toggle-container',
      }, [
        span({
          className: this.buttonCollapsedClass(),
        }),
      ]),
      div({ className: this.contentCollapsedClass() }, [
        div({}, [
          this.state.collapsed ? 'Panel is closed' : 'Panel is open',
        ]),
        div({ className: 'inherited-filter-container settings-view' }, [
          div({ className: 'inherited-filter checkbox' }, [
            label([
              input({ type: 'checkbox' }),
              'Inherited properties',
            ]),
          ]),
        ]),
        div({ className: 'search-box--container' }, [
          h('atom-text-editor', {
            mini: true,
            placeholder: 'Search...',
          }),
        ]),
      ]),
    ]);
  }

  generalCollapsedClass() {
    if (this.state.collapsed) {
      return 'symbol-viewer symbol-viewer--collapsed';
    }
    return 'symbol-viewer';
  }

  buttonCollapsedClass() {
    if (this.state.collapsed) {
      return 'symbol-viewer__toggle symbol-viewer__toggle--collapsed';
    }
    return 'symbol-viewer__toggle';
  }

  contentCollapsedClass() {
    if (this.state.collapsed) {
      return 'symbol-viewer__content symbol-viewer__content--collapsed';
    }
    return 'symbol-viewer__content';
  }
}
