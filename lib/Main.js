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

        var activeTextEditor = atom.workspace.getActiveTextEditor();
        if(activeTextEditor) {
            updateClassInfo(activeTextEditor);
        }

        var updateClassInfo = () => {
            var editor = atom.workspace.getActiveTextEditor();
            if(editor) {
                if(_.isUndefined(this.classInfoCache[editor.id])) {
                    this.classInfoCache[editor.id] = {};
                    this.classInfoCache[editor.id].model = getClassInfo(editor);
                    this.classInfoCache[editor.id].view = atom
                        .views
                        .getView(this.classInfoCache[editor.id].model);
                    this.updatePanel(this.classInfoCache[editor.id].view);
                }
                var updatedClassInfo = getClassInfo(editor);
                var newClassInfoElement = atom
                    .views
                    .getView(updatedClassInfo);
                this.classInfoCache[editor.id] = {
                    model: updatedClassInfo,
                    view: newClassInfoElement
                };
                this.updatePanel(this.classInfoCache[editor.id].view);
            } else {
                this.destroyPanel();
            }
        };

        _.delay(() => {
            atom.workspace.onDidChangeActivePaneItem(updateClassInfo);
        }, 2500);
    }
}
