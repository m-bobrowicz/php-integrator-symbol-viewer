'use babel';

import _ from 'lodash';
import { TextEditor } from 'atom';
import { CompositeDisposable } from 'event-kit';
import ClassInfoView from './ClassInfoView';
import ClassInfoModel from './ClassInfoModel';

const UPDATING_FAILED_MESSAGE = 'Updating class info failed propbably due to indexing being in progress. If the issue perisists please report it.';

module.exports = {

    activate: () => { },

    deactivate: function() {
        this.subscriptions.dispose();
        if(!_.isNil(this.panel)) {
            this.panel.destroy();
        }
    },

    service: null,

    panel: null,

    subscriptions: null,

    classInfoCache: {},

    initPanel: function() {
        if(!_.isNil(this.panel)) {
            return;
        }
        this.panel = atom
            .workspace
            .addRightPanel({
                item: document.createElement('div'),
                visible: true,
                className: 'php-integrator-symbol-viewer-panel'
            });
    },

    updatePanel: function(item) {
        if(_.isNil(this.panel.getItem().parentNode)) {
            return;
        }

        this
            .panel
            .getItem()
            .parentNode
            .replaceChild(item, this.panel.getItem());
        this.panel.item = item;
    },

    destroyPanel: function() {
        if(_.isNil(this.panel)) {
            return;
        }

        this.panel.destroy();
    },

    getClassInfo: function (editor) {
        var fullClassName = this.service.determineFullClassName(editor);
        return new ClassInfoModel(this.service.getClassInfo(fullClassName));
    },

    updateClassInfo: function(editor = atom.workspace.getActiveTextEditor()) {
        if(!(editor instanceof TextEditor) || editor.getGrammar().name !== 'PHP') {
            this.updatePanel(document.createElement('div'));
            return;
        }
        try {
            var fullClassName = this.service.determineFullClassName(editor);
            if(_.isUndefined(this.classInfoCache[fullClassName])) {
                this.classInfoCache[fullClassName] = {};
                this.classInfoCache[fullClassName].model = this.getClassInfo(editor);
                this.classInfoCache[fullClassName].view = atom
                .views
                .getView(this.classInfoCache[fullClassName].model);
                this.updatePanel(this.classInfoCache[fullClassName].view);
            }
            var updatedClassInfo = this.getClassInfo(editor);
            if(!_.isEqual(updatedClassInfo, this.classInfoCache[fullClassName].model)) {
                this.classInfoCache[fullClassName] = {
                    model: updatedClassInfo,
                    view: atom
                    .views
                    .getView(updatedClassInfo)
                };
            }
            this.updatePanel(this.classInfoCache[fullClassName].view);
        } catch (e) {
            console.warn(UPDATING_FAILED_MESSAGE);
        }
    },

    init: function(service) {
        this.subscriptions = new CompositeDisposable();
        this.classInfoCache = {};
        this.service = service;

        atom.views.addViewProvider(ClassInfoModel, ClassInfoView);

        _.delay(() => {
            this.initPanel();
            this.updateClassInfo();

            this.subscriptions.add(atom
                .workspace
                .onDidChangeActivePaneItem(this.updateClassInfo.bind(this)));
            this.subscriptions.add(atom
                .workspace
                .observeActivePaneItem(this.updateClassInfo.bind(this)));
            this.subscriptions.add(atom
                .workspace
                .observeTextEditors((editor) => {
                    var editorSubscription = editor.onDidSave(() => {
                        _.delay(this.updateClassInfo.bind(this, editor), 300);
                    })
                    this.subscriptions.add(editor.onDidDestroy(() => {
                        editorSubscription.dispose();
                    }));
            }));
        }, 1500);
    },

    dispose: function() {
        this.subscriptions.dispose();
    }
}
