'use babel';

import _ from 'lodash';
import ConstantsListView from './ConstantsListView';
import StaticPropertiesListView from './StaticPropertiesListView';
import StaticMethodsListView from './StaticMethodsListView';
import PropertiesListView from './PropertiesListView';
import MethodsListView from './MethodsListView';

module.exports = function FiguresView(figuresModel) {
    var container = document.createElement('atom-php-integrator-symbol-viewer-content');
    container.innerHTML = `
        <div class="figure-container">
            <div class="settings-view">
            <select class="figure-choice form-control">
                ${_.map(figuresModel, (figure) => `
                    <option value="${figure.name}">
                        ${figure.type} ${figure.shortName}
                    </option>
                `)}
            </select>
            </div>
        </div>
        ${_.map(figuresModel, (figure) => `
            <div class="lists-container" data-figure="${figure.name}">
                ${ConstantsListView(figure.constants, figure.name)}
                ${StaticPropertiesListView(figure.staticProperties, figure.name)}
                ${StaticMethodsListView(figure.staticMethods, figure.name)}
                ${PropertiesListView(figure.properties, figure.name)}
                ${MethodsListView(figure.methods, figure.name)}
            </div>
        `).join('')}
        <div class="filter-container">
            <div class="settings-view">
                <div class="control-group">
                    <div class="controls">
                        <div class="checkbox">
                            <label for="show-inherited-properties">
                                <input id="show-inherited-properties" type="checkbox">
                                <div class="setting-title">
                                    Show inherited properties
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="search-container">
        </div>
    `;

    var searchTextEditor = atom.workspace.buildTextEditor({ mini: true });
    searchTextEditor.setPlaceholderText('Search...');
    var showInheritedCheckbox = container.querySelector('#show-inherited-properties');
    showInheritedCheckbox.checked = atom.config.get('php-integrator-symbol-viewer.defaultShowInherited');
    var filterLists = () => {
        var listElements = _.toArray(container.querySelectorAll('.list-element'));
        _.each(listElements, (element) => {
            element.style.display = 'none';
            if(showInheritedCheckbox.checked) {
                element.style.display = 'block';
            } else {
                if(element.dataset.currentStructure === element.dataset.declaringStructureName) {
                    element.style.display = 'block';
                }
            }
            element.querySelector('.name').innerHTML = element.dataset.name;
        });

        var lists = _.toArray(container.querySelectorAll('.list'));
        _.each(lists, (list) => {
            list.style.display = 'block';
        });
        if(!!searchTextEditor.getText().length) {
            var input = searchTextEditor.getText().toLowerCase().split('');
            var inputRegex = new RegExp(input.map((c) => c + '.*').join(''));

            _.each(listElements, (element) => {
                var symbolName = element.dataset.name;
                if(inputRegex.test(symbolName.toLowerCase())) {
                    var charsToHighlight = input.slice(0);
                    var highlightedName = symbolName
                        .split('')
                        .map((c) => {
                            if(c.toLowerCase() === charsToHighlight[0]) {
                                charsToHighlight.shift();
                                return `
                                    <span class="highlighted-letter">
                                        ${c}
                                    </span>
                                `;
                            }
                            return c;
                        })
                        .join('');
                    element.querySelector('.name').innerHTML = highlightedName;
                } else {
                    element.style.display = 'none';
                }
            });

            var lists = _.toArray(container.querySelectorAll('.list'));
            _.each(lists, (list) => {
                var elements = _(list.querySelectorAll('.list-element'))
                    .toArray()
                    .filter((e) => e.style.display === 'block')
                    .value();

                if(elements.length < 1) {
                    list.style.display = 'none';
                }
            });
        }
    };
    searchTextEditor.onDidStopChanging(filterLists);
    showInheritedCheckbox.onchange = filterLists;
    var searchContainer = container.querySelector('.search-container');
    searchContainer.appendChild(atom.views.getView(searchTextEditor));

    var figureChoice = container.querySelector('.figure-choice');
    var updateList = () => {
        var currentClass = figureChoice.value;
        var lists = _.toArray(container.querySelectorAll('.lists-container'));
        lists
            .forEach((l) => l.classList.remove('active'));
        lists
            .filter((l) => l.dataset.figure === currentClass)
            .forEach((l) => l.classList.add('active'));
        filterLists();
    };
    figureChoice.onchange = updateList;
    updateList();

    var listElements = container.querySelectorAll('.list-element');
    [].forEach.call(listElements, (listElement) => {
        var detailsElement = listElement.querySelector('.details');

        listElement.querySelector('.name').onclick = () => {
            var file = listElement.dataset.declaringStructureFile;
            var line = listElement.dataset.declaringStructureLine;
            atom
                .workspace
                .open(file, { initialLine: parseInt(line) - 1 })
                .then((e) => e.scrollToCursorPosition({ center: true }));
        };
        listElement.querySelector('.info').onclick = () => {
            listElement.classList.toggle('active');
            detailsElement.classList.toggle('active');
        };
    });

    return container;
}
