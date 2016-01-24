'use babel';

import _ from 'lodash';
import ClassInfoView from './ClassInfoView';
import ClassInfoModel from './ClassInfoModel';

module.exports = {

    activate: () => {

    },

    classInfoCache: {},

    updatePanel: function(item) {
        var currentPanel = atom
            .workspace
            .getRightPanels()
            .find((p) => p.className === 'php-integrator-symbol-viewer-panel');
        if(!_.isUndefined(currentPanel)) {
            currentPanel.destroy();
        }
        return atom
            .workspace
            .addRightPanel({
                item: item,
                visible: true,
                className: 'php-integrator-symbol-viewer-panel'
            });
    },

    destroyPanel: function() {
        var currentPanel = atom
            .workspace
            .getRightPanels()
            .find((p) => p.className === 'php-integrator-symbol-viewer-panel');
        if(!_.isUndefined(currentPanel)) {
            currentPanel.destroy();
        }
    },

    init: function(service) {
        this.classInfoCache = {};
        var getClassInfo = (editor) => {
            var fullClassName = service.determineFullClassName(editor);
            return new ClassInfoModel(service.getClassInfo(fullClassName));
        };

        atom.views.addViewProvider(ClassInfoModel, ClassInfoView);

        var updateClassInfo = _.debounce((editor) => {
            if(_.isUndefined(editor)) {
                var editor = atom.workspace.getActiveTextEditor();
            }
            if(editor && editor.getGrammar && editor.getGrammar().name === 'PHP') {
                var fullClassName = service.determineFullClassName(editor);
                if(_.isUndefined(this.classInfoCache[fullClassName])) {
                    this.classInfoCache[fullClassName] = {};
                    this.classInfoCache[fullClassName].model = getClassInfo(editor);
                    this.classInfoCache[fullClassName].view = atom
                    .views
                    .getView(this.classInfoCache[fullClassName].model);
                    this.updatePanel(this.classInfoCache[fullClassName].view);
                }
                var updatedClassInfo = getClassInfo(editor);
                if(!_.isEqual(updatedClassInfo, this.classInfoCache[fullClassName].model)) {
                    var newClassInfoElement = atom
                    .views
                    .getView(updatedClassInfo);
                    this.classInfoCache[fullClassName] = {
                        model: updatedClassInfo,
                        view: newClassInfoElement
                    };
                }
                this.updatePanel(this.classInfoCache[fullClassName].view);
            } else {
                this.destroyPanel();
            }
        }, 250);

        _.delay(() => {
            updateClassInfo();
            atom.workspace.onDidChangeActivePaneItem(updateClassInfo);
            atom.workspace.observeActivePaneItem(updateClassInfo);
            atom.workspace.observeTextEditors((editor) => {
                editor.onDidSave(() => {
                    _.delay(updateClassInfo.bind(this, editor), 300);
                });
            });
        }, 1500);
    }
}
