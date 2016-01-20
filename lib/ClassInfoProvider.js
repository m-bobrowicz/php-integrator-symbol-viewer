'use babel';

import _ from 'lodash'

module.exports = class ClassProvider {
    constructor(service) {
        this.service = service;
    }

    getInfoForClass(editor) {
        var fullClassName = this.service.determineFullClassName(editor)
        var classInfo = this.service.getClassInfo(fullClassName)
        return {
            type: classInfo.type,
            shortName: classInfo.shortName,
            constants: _(classInfo.constants)
                .values()
                .sortBy('name')
                .value(),
            properties: _(classInfo.properties)
                .values()
                .sortBy('name')
                .value(),
            staticMethods: _(classInfo.methods)
                .values()
                .filter((m) => m.isStatic)
                .sortBy('name')
                .sortBy((m) => m.isPublic ? -1 : 1)
                .sortBy((m) => m.isPrivate ? -1 : 1)
                .value(),
            methods: _(classInfo.methods)
                .values()
                .filter((m) => !m.isStatic)
                .sortBy('name')
                .sortBy((m) => m.isPublic ? -1 : 1)
                .sortBy((m) => m.isPrivate ? -1 : 1)
                .sortBy((m) => m.name.search(/^[gs]et[A-Z]/) == 0 ? 1 : -1 )
                .sortBy((m) => m.name.search(/^__/) == 0 ? 1 : -1)
                .value()
        }
    }

    createClassInfoElement (classInfo) {
        var createBullet = (character) => {
            var container = document.createElement('div');
            container.classList.add('bullet-container');
            var content = document.createElement('div');
            content.classList.add('bullet-content');
            content.textContent = character;
            container.appendChild(content);
            return container;
        };

        var goToClassElement = (element) => () => {
            var options = { initialLine: parseInt(element.declaringStructure.startLineMember) - 1 };
            atom.workspace.open(element.declaringStructure.filename, options);
        }

        var classInfoElement = document.createElement('div')
        classInfoElement.classList.add('php-integrator-symbol-viewer')

        var classHeaderElement = document.createElement('h5')
        classHeaderElement.textContent = classInfo.type + ' ' + classInfo.shortName
        classInfoElement.appendChild(classHeaderElement)

        var constantsList = document.createElement('ul')
        constantsList.classList.add('php-integrator-sub-list')
        constantsList.classList.add('php-integrator-constants-sub-list')
        _.each(classInfo.constants, (constant) => {
            var constantsListElement = document.createElement('li')
            constantsListElement.appendChild(createBullet('C'))
            constantsListElement.onclick = goToClassElement(constant)
            var constantsListElementTextContent = document.createElement('span')
            constantsListElementTextContent.textContent = constant.name;
            constantsListElement.appendChild(constantsListElementTextContent)
            constantsList.appendChild(constantsListElement)
            classInfoElement.appendChild(constantsList)
        });

        var staticMethodsList = document.createElement('ul')
        staticMethodsList.classList.add('php-integrator-static-methods-sub-list')
        staticMethodsList.classList.add('php-integrator-sub-list')
        _.each(classInfo.staticMethods, (staticMethod) => {
            var staticMethodsListElement = document.createElement('li')
            staticMethodsListElement.appendChild(createBullet('S'))
            staticMethodsListElement.onclick = goToClassElement(staticMethod)
            var staticMethodsListElementTextContent = document.createElement('span')
            staticMethodsListElementTextContent.textContent = staticMethod.name
            if(staticMethod.isPublic) {
                staticMethodsListElementTextContent.classList.add('php-public')
            }
            staticMethodsListElement.appendChild(staticMethodsListElementTextContent)
            staticMethodsList.appendChild(staticMethodsListElement)
            classInfoElement.appendChild(staticMethodsList)
        });

        var propertiesList = document.createElement('ul')
        propertiesList.classList.add('php-integrator-sub-list')
        propertiesList.classList.add('php-integrator-properties-sub-list')
        _.each(classInfo.properties, (property) => {
            var propertiesListElement = document.createElement('li')
            propertiesListElement.appendChild(createBullet('P'))
            propertiesListElement.onclick = goToClassElement(property)
            var propertiesListElementTextContent = document.createElement('span')
            propertiesListElementTextContent.textContent = property.name;
            propertiesListElement.appendChild(propertiesListElementTextContent)
            propertiesList.appendChild(propertiesListElement)
            classInfoElement.appendChild(propertiesList)
        });

        var methodsList = document.createElement('ul')
        methodsList.classList.add('php-integrator-methods-sub-list')
        methodsList.classList.add('php-integrator-sub-list')
        _.each(classInfo.methods, (method) => {
            var methodsListElement = document.createElement('li')
            methodsListElement.appendChild(createBullet('M'))
            methodsListElement.onclick = goToClassElement(method)
            var methodsListElementTextContent = document.createElement('span')
            methodsListElementTextContent.textContent = method.name
            if(method.name.search(/^get[A-Z]/) == 0) {
                methodsListElementTextContent.classList.add('php-getter')
            }
            if(method.name.search(/^set[A-Z]/) == 0) {
                methodsListElementTextContent.classList.add('php-setter')
            }
            if(method.isPublic) {
                methodsListElementTextContent.classList.add('php-public')
            }
            if(method.name.search(/^__/) == 0) {
                methodsListElementTextContent.classList.add('php-magic')
            }
            methodsListElement.appendChild(methodsListElementTextContent)
            methodsList.appendChild(methodsListElement)
            classInfoElement.appendChild(methodsList)
        });

        return classInfoElement
    }

    updateView(editor) {
        var classInfoData = this.getInfoForClass(editor)
        return this.createClassInfoElement(classInfoData)
    }
}
