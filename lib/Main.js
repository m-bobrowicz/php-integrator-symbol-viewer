'use babel';

import {Disposable} from 'atom';
import ClassInfoProvider from './ClassInfoProvider';
import ClassInfoView from './ClassInfoView';
import ClassInfoModel from './ClassInfoModel';

module.exports = {
    classInfoProvider: null,

    activate: () => { },

    deactivate: () => this.deactivateInfoProvider(),


    deactivateInfoProvider: () => {
        this.classInfoProvider.deactivate();
        this.classInfoProvider = null;
    },

    activateInfoProvider: (service) => {
        this.classInfoProvider = new ClassInfoProvider(service)

        atom.views.addViewProvider(ClassInfoModel, ClassInfoView);

        var updateClassInfo = function (editor) {
            var classInfo = this.classInfoProvider.getClassInfo(editor);
            var classInfoElement = atom.views.getView(classInfo);
            atom.views.getView(editor).shadowRoot.appendChild(classInfoElement);
            var replaceView = function () {
                _.delay((() => {
                    var textEditorEl = atom.views.getView(editor).shadowRoot;
                    var currentClassInfoElement = textEditorEl.querySelector(".php-integrator-symbol-viewer");
                    var classInfo = this.classInfoProvider.getClassInfo(editor);
                    var newClassInfoElement = atom.views.getView(classInfo);
                    textEditorEl.replaceChild(newClassInfoElement, currentClassInfoElement);
                }).bind(this), 900);
            };
            editor.onDidChange(replaceView.bind(this));
        };

        atom.workspace.observeTextEditors(updateClassInfo.bind(this));
        return new Disposable((function () {
            this.deactivateProvider();
        }).bind(this));
    }
}
