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

var goToClassElement = ({ declaringStructure: { filename, startLineMember} }) =>
    () => atom.workspace.open(filename, {
        initialLine: parseInt(startLineMember) - 1
    });

var createTitle = ({ type, shortName }) => {
    var title = document.createElement('div');
    title.classList.add('title');
    title.appendChild(createBullet(type));
    titleName = document.createElement('span');
    titleName.classList.add('title-name');
    titleName.textContent = shortName;
    title.appendChild(titleName);

    return title;
};

var createFilterInput = (classInfoElement) => {
    var filterInputContainer = document.createElement('div');
    filterInputContainer.classList.add('input-container');
    var filterInput = atom.workspace.buildTextEditor({
        mini: true
    });
    filterInput.setPlaceholderText('Search...');
    var disposable = filterInput.onDidStopChanging(() => {
        var inputText = filterInput.getText();
        var listElements = _.toArray(classInfoElement.querySelectorAll('.list li'));

        _.each(listElements, (element) => {
            element.style.display = 'list-item';
            if(inputText) {
                var symbolText = element.getAttribute('data-name').toLowerCase();
                inputText = inputText.toLowerCase();
                if(symbolText.indexOf(inputText) == -1) {
                    element.style.display = 'none';
                }
            }
        });
    });
    filterInputContainer.appendChild(atom.views.getView(filterInput));
    return filterInputContainer;
};

var createDependenciesFilters = (classInfoModel, classInfoElement) => {
    var dependenciesFiltersContainer = document.createElement('div');
    _.each(classInfoModel.dependencies, (d) => {
        var dependencyFilter = document.createElement('div');
        dependencyFilter.classList.add('dependencies-filter');
        dependencyFilter.setAttribute('data-declaring-structure', d.name);
        dependencyFilter.appendChild(createBullet(d.bulletChar));
        var dependencyName = document.createElement('span');
        dependencyName.textContent = d.shortName;
        dependencyFilter.appendChild(dependencyName);

        dependencyFilter.onclick = () => {
            dependencyFilter.classList.toggle('active');
            var activeFilters = _
                .toArray(classInfoElement.querySelectorAll('.dependencies-filter.active'))
                .map(el => el.getAttribute('data-declaring-structure'));
            var listElements = _.toArray(classInfoElement.querySelectorAll('.list li'));
            _.each(listElements, (element) => {
                element.style.display = 'list-item';
                if(_.isEmpty(activeFilters)) return;
                if(!_.includes(activeFilters, element.getAttribute('data-declaring-structure'))) {
                    element.style.display = 'none';
                }
            });
        };

        dependenciesFiltersContainer.appendChild(dependencyFilter);
    });
    return dependenciesFiltersContainer;
};

var createHeader = (classInfoModel, classInfoElement) => {
    var header = document.createElement('div');
    header.classList.add('header');
    header.appendChild(createFilterInput(classInfoElement));
    header.appendChild(createTitle(classInfoModel));
    return header;
};

var createSymbolList = (symbols, className, bulletCharacter) => {
    var list = document.createElement('ul');
    list.classList.add('list');
    list.classList.add(className);
    _.each(symbols, (symbol) => {
        var listItem = document.createElement('li');
        listItem.setAttribute('data-name', symbol.name);
        listItem.setAttribute('data-declaring-structure', symbol.declaringStructure.name);
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

var createSymbolsLists = (classInfoModel, classInfoElement) => {
    var subListContainer = document.createElement('div');
    subListContainer.classList.add('list-container');
    subListContainer.appendChild(createDependenciesFilters(classInfoModel, classInfoElement));
    var subLists = [
        [ classInfoModel.constants, 'constants-list', 'C' ],
        [ classInfoModel.staticProperties, 'static-properties-list', 'P' ],
        [ classInfoModel.staticMethods, 'static-methods-list', 'M' ],
        [ classInfoModel.properties, 'properties-list', 'P' ],
        [ classInfoModel.methods, 'methods-list', 'M' ]
    ];
    return _(subLists)
        .reject(([symbols]) => _.isEmpty(symbols))
        .map((data) => createSymbolList.apply(null, data))
        .reduce((container, element) => {
            container.appendChild(element);
            return container;
        }, subListContainer);
};

module.exports = function ClassInfoView(classInfoModel) {
    var classInfoElement = document.createElement('atom-php-integrator-symbol-viewer');
    classInfoElement.appendChild(createHeader(classInfoModel, classInfoElement));
    classInfoElement.appendChild(createSymbolsLists(classInfoModel, classInfoElement));
    return classInfoElement;
}
