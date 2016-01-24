'use babel';

import _ from 'lodash';

var createBullet = (character) => {
    var container = document.createElement('div');
    container.classList.add('bullet-container');
    var content = document.createElement('div');
    content.classList.add('bullet-content');
    content.textContent = character;
    container.appendChild(content);
    return container;
};

var goToClassElement = ({ declaringStructure }) => () => atom.workspace.open(
    declaringStructure.filename,
    { initialLine: parseInt(declaringStructure.startLineMember) - 1 }
);

var createHeader = ({type, shortName}) => {
    var header = document.createElement('div')
    header.classList.add('list-header');
    headerType = document.createElement('span');
    headerType.textContent = type;
    header.appendChild(headerType);
    headerName = document.createElement('span');
    headerName.classList.add('list-header-name');
    headerName.textContent = shortName;
    header.appendChild(headerName);
    return header;
};

var createFilterInput = (classInfoElement) => {
    var filterInputContainer = document.createElement('div');
    filterInputContainer.classList.add('input-container');
    var filterInput = atom.workspace.buildTextEditor({
        mini: true
    });
    filterInput.setPlaceholderText('Search...');
    filterInput.onDidStopChanging(() => {
        var inputText = filterInput.getText();
        var listElements = classInfoElement.querySelectorAll('.list li');
        if(inputText) {
            [].forEach.call(listElements, (element) => {
                var symbolName = element.querySelector('span');
                var symbolText = symbolName.textContent.toLowerCase();
                inputText = inputText.toLowerCase();
                if(symbolText.indexOf(inputText) == -1) {
                    element.style.display = 'none';
                }
            });
        } else {
            [].forEach.call(listElements, (element) => {
                element.style.display = 'list-item';
            });

        }
    });
    filterInputContainer.appendChild(atom.views.getView(filterInput));
    return filterInputContainer;
};

var createSymbolList = (symbols, className, bulletCharacter) => {
    var list = document.createElement('ul');
    list.classList.add('list');
    list.classList.add(className);
    _.each(symbols, (symbol) => {
        var listItem = document.createElement('li');
        listItem.appendChild(createBullet(bulletCharacter));
        listItem.onclick = goToClassElement(symbol);
        var listItemText = document.createElement('span');
        listItemText.textContent = symbol.name;
        if(symbol.isPublic) {
            listItemText.classList.add('public');
        }
        listItem.appendChild(listItemText);
        list.appendChild(listItem);
    });
    return list;
};

var createSymbolsLists = ({
    constants, staticProperties, staticMethods, properties, methods
}) => {
    var subListContainer = document.createElement('div');
    subListContainer.classList.add('list-container');
    [
        [ constants, 'constants-list', 'C' ],
        [ staticProperties, 'static-properties-list', 'P' ],
        [ staticMethods, 'static-methods-list', 'M' ],
        [ properties, 'properties-list', 'P' ],
        [ methods, 'methods-list', 'M' ]
    ].forEach((symbolData) => {
        subListContainer.appendChild(createSymbolList.apply(null, symbolData));
    });
    return subListContainer;
};

module.exports = function ClassInfoView(classInfoModel) {
    var classInfoElement = document.createElement('div');
    classInfoElement.classList.add('php-integrator-symbol-viewer');
    classInfoElement.appendChild(createFilterInput(classInfoElement));
    classInfoElement.appendChild(createHeader(classInfoModel));
    classInfoElement.appendChild(createSymbolsLists(classInfoModel));
    return classInfoElement;
}
