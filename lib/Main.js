'use babel';

import {Disposable} from 'atom';
import ClassInfoProvider from './ClassInfoProvider';

module.exports = {
    classInfoProvider: null,

    activate: function () { },

    deactivate: function () {
        this.deactivateProvider()
    },

    activateProvider: function(service) {
        this.classInfoProvider = new ClassInfoProvider(service)

        var updateClassInfo = function (editor) {
            var classInfoElement = this.classInfoProvider.updateView(editor);
            atom.views.getView(editor).shadowRoot.appendChild(classInfoElement);
            var replaceView = function () {
                _.delay((function () {
                    var textEditorEl = atom.views.getView(editor).shadowRoot;
                    var currentClassInfoElement = textEditorEl.querySelector(".php-integrator-symbol-viewer");
                    var newClassInfoElement = this.classInfoProvider.updateView(editor);
                    textEditorEl.replaceChild(newClassInfoElement, currentClassInfoElement);
                }).bind(this), 900);
            };
            editor.onDidChange(replaceView.bind(this));
        };

        atom.workspace.observeTextEditors(updateClassInfo.bind(this));
    },

    deactivateProvider: function () {
        this.classInfoProvider.deactivate()
        this.classInfoProvider = null
    },


    setService: function(service) {
        this.activateProvider(service);
        return new Disposable((function () {
            this.deactivateProvider();
        }).bind(this));
    }
}
