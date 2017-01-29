'use babel';

import 'reflect-metadata';
import R from 'ramda';
import ReactDOM from 'react-dom';
import h from 'react-hyperscript';
import {Container} from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import Promise from 'bluebird';
import TYPES from './types';
import store from './store';
import SymbolViewerComponent from './symbol-viewer.component';
import TogglePanelAction from './actions/toggle-panel.action';

export default {
    activate() {
        const container = new Container();
        const { lazyInject } = getDecorators(container);
        container.bind(TYPES.Store).toConstantValue(store);
        container.bind(TYPES.TogglePanelAction).toConstantValue(TogglePanelAction);

        lazyInject(TYPES.Store)(TogglePanelAction, 'store');
        lazyInject(TYPES.Store)(SymbolViewerComponent.prototype, 'store');
        lazyInject(TYPES.TogglePanelAction)(SymbolViewerComponent.prototype, 'togglePanel');

        const item = document.createElement('atom-php-integrator-symbol-viewer');
        atom.workspace.addRightPanel({ item, visible: true });
        ReactDOM.render(h(SymbolViewerComponent), item);
    },

    connectPhpIntegrator(service) {
        const activeTextEditor = atom.workspace.getActiveTextEditor();
        const activeFilePath = activeTextEditor.getPath();
        service.onDidFinishIndexing(() => {
            service
                .getClassListForFile(activeFilePath)
                .then(R.mapObjIndexed((classInfo, className) => service.getClassInfo(className)))
                .then((classInfoPromises) => Promise.props(classInfoPromises))
                .then((result) => console.log(result));
        });
    },
};
