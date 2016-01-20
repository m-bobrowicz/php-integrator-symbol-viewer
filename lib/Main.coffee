{Disposable} = require 'atom'

ClassInfoProvider         = require './ClassInfoProvider'

module.exports =
    ###*
     * class information provider
    ###
    classInfoProvider: null

    ###*
     * Activates the package.
    ###
    activate: ->

    ###*
     * Deactivates the package.
    ###
    deactivate: ->
        @deactivateProvider()

    ###*
     * Activates the provider using the specified service.
    ###
    activateProvider: (service) ->
        @classInfoProvider = new ClassInfoProvider()
        @classInfoProvider.activate(service)

        updateClassInfo = (editor) ->
            classInfoElement = @classInfoProvider.updateView(editor)
            atom.views.getView(editor).shadowRoot.appendChild(classInfoElement)
            replaceView = ->
                _.delay (() ->
                    textEditorEl = atom.views.getView(editor).shadowRoot
                    currentClassInfoElement = textEditorEl.querySelector(".php-integrator-symbol-viewer")
                    newClassInfoElement = @classInfoProvider.updateView(editor)
                    textEditorEl.replaceChild(newClassInfoElement, currentClassInfoElement)).bind(this)
                    , 900
            editor.onDidChange replaceView.bind(this)

        atom.workspace.observeTextEditors updateClassInfo.bind(this)

    ###*
     * Deactivates any active provider.
    ###
    deactivateProvider: () ->
        @classInfoProvider.deactivate()
        @classInfoProvider = null

    ###*
     * Sets the php-integrator service.
     *
     * @param {mixed} service
    ###
    setService: (service) ->
        @activateProvider(service)
        return new Disposable => @deactivateProvider()
