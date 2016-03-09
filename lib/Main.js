'use babel';

import { TextEditor } from 'atom';
import { CompositeDisposable } from 'event-kit';
import _ from 'lodash';
import FiguresModel from './FiguresModel';
import FiguresView from './FiguresView';
import EmptyFiguresModel from './EmptyFiguresModel';
import EmptyFiguresView from './EmptyFiguresView';

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

  activate: function() {
    atom.views.addViewProvider(FiguresModel, FiguresView);
    atom.views.addViewProvider(EmptyFiguresModel, EmptyFiguresView);
  },

  deactivate: function() {
    this.subscriptions.dispose();
    if (!_.isNil(this.panel)) this.panel.destroy();
  },

  service: null,

  panel: null,

  subscriptions: null,

  initPanel: function() {
    if (!_.isNil(this.panel)) return;
    var panelOptions = {
      item: document.createElement('div'),
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
    if (_.isNil(this.panel)) return;
    if (this.panel.isVisible()) {
      this.panel.hide();
    } else {
      this.panel.show();
    }
  },

  updatePanel: function(item) {
    var panelItem = item;
    if(_.isNil(this.panel)) this.initPanel();
    if(_.isNil(this.panel.getItem().parentNode)) return;
    if(_.isNil(panelItem)) {
        panelItem = atom.views.getView(new EmptyFiguresModel());
    }
    this
      .panel
      .getItem()
      .parentNode
      .replaceChild(panelItem, this.panel.getItem());
    this.panel.item = panelItem;
  },

  destroyPanel: function() {
    if (_.isNil(this.panel)) return;
    this.panel.destroy();
    this.panel = null;
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
    if (_.some(editorErrors, (f) => f())) return this.destroyPanel();

    var getFigureInfo = (f) => this.service.getClassInfo(f.name, true);
    var onSuccess = (emptyFiguresData) => {
        Promise.all(_(emptyFiguresData).values().map(getFigureInfo).value())
            .then((figuresData) => {
                if(_.isEmpty(figuresData)) return this.updatePanel();
                var figuresModel = new FiguresModel(figuresData);
                this.updatePanel(atom.views.getView(figuresModel));
            });
    }
    var onError = (e) => console.warn(UPDATING_FAILED_MESSAGE, e.message);

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
