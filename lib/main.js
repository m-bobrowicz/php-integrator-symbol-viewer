'use babel';

import 'reflect-metadata';
import ReactDOM from 'react-dom';
import h from 'react-hyperscript';
import store from './store';
import TogglePanelAction from './actions/toggle-panel.action';
import SymbolViewerComponent from './symbol-viewer.component';
import {Container} from 'inversify';
import getDecorators from 'inversify-inject-decorators';

const TYPES = {
    Store: Symbol('Store'),
    TogglePanelAction: Symbol('TogglePanelAction')
};

export default {
    activate() {
        const container = new Container();
        const {lazyInject} = getDecorators(container);
        container.bind(TYPES.Store).toConstantValue(store);
        container.bind(TYPES.TogglePanelAction).toConstantValue(TogglePanelAction);

        lazyInject(TYPES.Store)(TogglePanelAction, 'store');
        lazyInject(TYPES.Store)(SymbolViewerComponent, 'store');
        lazyInject(TYPES.TogglePanelAction)(SymbolViewerComponent, 'togglePanel');

        const item = document.createElement('atom-php-integrator-symbol-viewer');
        const panel = atom.workspace.addRightPanel({item, visible: true});

        ReactDOM.render(h(SymbolViewerComponent), item);
    }
};
