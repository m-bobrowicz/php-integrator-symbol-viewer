'use babel';

import _ from 'lodash';
import { TextEditor } from 'atom';
import { CompositeDisposable } from 'event-kit';
import ClassInfoView from './ClassInfoView';
import ClassInfoModel from './ClassInfoModel';

const UPDATING_FAILED_MESSAGE = 'Updating class info failed propbably due to indexing being in progress or errors in PHP code. If the issue perisists please report it.';
const SERVICE_UNDEFINED_MESSAGE = 'Package could not be activated probably because php-integrator-base is missing.';

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

    initPanel: function() {
        if(!_.isNil(this.panel)) {
            return;
        }
        var panelOptions = {
            item: document.createElement('atom-php-integrator-symbol-viewer'),
            visible: true
        };
        this.panel = atom
            .workspace
            .addRightPanel(panelOptions);
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
        var fullClassName = this.service.determineFullClassName(editor);
        this
            .service
            .getClassInfo(fullClassName, true)
            .then(
                (updatedClassInfo) => {
                    this.updatePanel(atom
                        .views
                        .getView(new ClassInfoModel(updatedClassInfo)));
                },
                (e) => {
                    console.warn(UPDATING_FAILED_MESSAGE);
                    console.log('Further info:' + e.message);
                }
            );
    },

    init: function(service) {
        if(_.isNil(service)) {
            console.warn(SERVICE_UNDEFINED_MESSAGE);
            return;
        }

        this.subscriptions = new CompositeDisposable();
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
