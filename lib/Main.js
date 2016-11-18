'use babel';

import {
    TextEditor
} from 'atom';
import {
    CompositeDisposable
} from 'event-kit';
import _ from 'lodash';
import FiguresModel from './FiguresModel';
import FiguresView from './FiguresView';
import TogglePanelButtonView from './TogglePanelButtonView';

const UPDATING_FAILED_MESSAGE = 'Updating class info failed propbably due to indexing being in progress or errors in PHP code. If the issue perisists please report it.';
const SERVICE_UNDEFINED_MESSAGE = 'Package could not be activated probably because php-integrator-base is missing.';

module.exports = {
    config: {
        panelSide: {
            title: 'Display side',
            description: 'Whether the panel should be displayed on left or right side.',
            type: 'string',
            default: 'right',
            enum: ['left', 'right']
        },
        defaultShowInherited: {
            title: 'Display inherited properties by default',
            description: 'Whether to display properties inherited from parents / traits / interfaces by default.',
            type: 'boolean',
            default: false,
        }
    },

    state: {
        panelCollapsed: false
    },

    activate: function(state) {
        this.state = state;
        atom.views.addViewProvider(FiguresModel, FiguresView);
    },

    deactivate: function() {
        this.subscriptions.dispose();
        if (!_.isNil(this.panel)) this.panel.destroy();
    },

    serialize: function() {
        return this.state;
    },

    service: null,

    panel: null,

    subscriptions: null,

    initPanel: function() {
        if (!_.isNil(this.panel)) return;
        var panelElement = document.createElement('atom-php-integrator-symbol-viewer');
        TogglePanelButtonView(panelElement, this.togglePanel.bind(this));
        if(this.state.panelCollapsed) {
            panelElement.classList.add('collapsed');
        }
        var panelOptions = {
            item: panelElement,
            visible: true
        };
        var panelSide = atom.config.get('php-integrator-symbol-viewer.panelSide');
        if (panelSide === 'right') {
            this.panel = atom.workspace.addRightPanel(panelOptions);
        } else if (panelSide === 'left') {
            this.panel = atom.workspace.addLeftPanel(panelOptions);
        } else {
            console.warn('Invalid panel side option.');
        }
    },

    togglePanel: function() {
        var editor = atom.workspace.getActiveTextEditor();
        var errors = [
            () => atom.workspace.getTextEditors().length < 1,
            () => _.isNil(editor),
            () => _.isNil(this.panel),
            () => !(editor instanceof TextEditor),
            () => editor.getGrammar().name !== 'PHP',
            () => _.isNil(editor.buffer.file),
            () => _.isNil(editor.buffer.file.path),
        ];
        if (_.some(errors, (f) => f())) return;
        this.panel.item.classList.toggle('collapsed');
    },

    updatePanel: function(newContent) {
        var newPanelContent = newContent;
        if (_.isNil(this.panel)) this.initPanel();
        if (_.isNil(this.panel.item)) this.initPanel();
        if (_.isNil(newPanelContent)) this.disablePanel();
        var currentContent = this
            .panel
            .item
            .querySelector('atom-php-integrator-symbol-viewer-content');
        if (currentContent) {
            this.panel.item.replaceChild(newPanelContent, currentContent);
        } else {
            this.panel.item.appendChild(newPanelContent);
        }
    },

    destroyPanel: function() {
        if (_.isNil(this.panel)) return;
        this.panel.destroy();
        this.panel = null;
    },

    showPanel: function() {
        if (_.isNil(this.panel)) return;
        this.state.panelCollapsed = false;
        this.panel.item.classList.remove('collapsed');
    },

    disablePanel: function() {
        if (_.isNil(this.panel)) return;
        this.state.panelCollapsed = this.panel.item.classList.contains('collapsed');
        this.panel.item.classList.add('collapsed');
    },

    updateClassInfo: function() {
        var editor = atom.workspace.getActiveTextEditor();

        var editorErrors = [
            () => atom.workspace.getTextEditors().length < 1,
            () => _.isNil(editor),
            () => !(editor instanceof TextEditor),
            () => editor.getGrammar().name !== 'PHP',
            () => _.isNil(editor.buffer.file),
            () => _.isNil(editor.buffer.file.path),
        ];
        if (_.some(editorErrors, (f) => f())) return this.disablePanel();
        if (false === this.state.panelCollapsed) {
            this.showPanel();
        }
        var getFigureInfo = (f) => this.service.getClassInfo(f.name, true);
        var onSuccess = (emptyFiguresData) => {
            var promises = _(emptyFiguresData).values().map(getFigureInfo).value();
            Promise
                .all(promises)
                .then((figuresData) => {
                    if (_.isEmpty(figuresData)) return this.updatePanel();
                    var figuresModel = new FiguresModel(figuresData);
                    this.updatePanel(atom.views.getView(figuresModel));
                });
        }
        var onError = (e) => console.warn(UPDATING_FAILED_MESSAGE, e);

        var path = editor.buffer.file.path;
        this.service.getClassListForFile(path, true).then(onSuccess, onError);
    },

    init: function(service) {
        if (_.isNil(service)) return console.warn(SERVICE_UNDEFINED_MESSAGE);

        this.service = service;
        this.subscriptions = new CompositeDisposable();

        _.delay(() => {
            this.initPanel();
            this.updateClassInfo();
            this.registerCommands.bind(this)();
            this.registerEvents.bind(this)();
        }, 1500);
    },

    registerEvents: function() {
        var subscriptions = [
            atom.workspace.onDidChangeActivePaneItem(this.updateClassInfo.bind(this)),
            this.service.onDidFinishIndexing(this.updateClassInfo.bind(this)),
            atom.config.onDidChange('php-integrator-symbol-viewer.panelSide', () => {
                this.destroyPanel();
                this.initPanel();
            })
        ];

        subscriptions.forEach((sub) => this.subscriptions.add(sub));
    },

    registerCommands: function() {
        var togglePanel = atom.commands.add(
            'atom-workspace',
            'php-integrator-symbol-viewer:toggle-panel',
            (e) => this.togglePanel()
        );
        this.subscriptions.add(togglePanel);
    },

    dispose: function() {
        this.subscriptions.dispose();
    }
}
