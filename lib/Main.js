'use babel';

import _ from 'lodash';
import ClassInfoView from './ClassInfoView';
import ClassInfoModel from './ClassInfoModel';

module.exports = {

    activate: () => { },

    init: function(service) {
        this.classInfoCache = {};
        var getClassInfo = (editor) => {
            var fullClassName = service.determineFullClassName(editor);
            return new ClassInfoModel(service.getClassInfo(fullClassName));
        };

        atom.views.addViewProvider(ClassInfoModel, ClassInfoView);

        var updateClassInfo = (editor) => {
            if(_.isUndefined(this.classInfoCache[editor.id])) {
                this.classInfoCache[editor.id] = {};
                this.classInfoCache[editor.id].model = getClassInfo(editor);
                this.classInfoCache[editor.id].view = atom
                    .views
                    .getView(this.classInfoCache[editor.id].model);
                atom
                    .views
                    .getView(editor)
                    .shadowRoot
                    .appendChild(this.classInfoCache[editor.id].view);
            }

            var updateViewIfModelChanged = () => {
                _.delay(() => {
                    var updatedClassInfo = getClassInfo(editor);
                    if(!_.isEqual(updatedClassInfo, this.classInfoCache[editor.id].model)) {
                            var newClassInfoElement = atom
                                .views
                                .getView(updatedClassInfo);
                            this.classInfoCache[editor.id].view
                                .parentNode
                                .replaceChild(newClassInfoElement, this.classInfoCache[editor.id].view);
                            this.classInfoCache[editor.id] = {
                                model: updatedClassInfo,
                                view: newClassInfoElement
                            };
                    }
                }, 300);
            };

            var clearEditorCache = () => delete this.classInfoCache[editor.id];

            editor.onDidSave(updateViewIfModelChanged);
            editor.onDidDestroy(clearEditorCache);
        };

        _.delay(() => {
            atom.workspace.observeTextEditors(updateClassInfo.bind(this));
        }, 2500);
    }
}
