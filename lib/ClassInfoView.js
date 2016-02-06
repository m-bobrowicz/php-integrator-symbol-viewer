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

var goToClassElement = ({
    declaringStructure: {
      filename, startLineMember
    }
  }) =>
  () => atom.workspace.open(filename, {
    initialLine: parseInt(startLineMember) - 1
  });

var createTitle = ({
  type, shortName
}) => {
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
      if (inputText) {
        var symbolText = element.getAttribute('data-name').toLowerCase();
        inputText = inputText.toLowerCase();
        if (symbolText.indexOf(inputText) == -1) {
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
        if (_.isEmpty(activeFilters)) return;
        if (!_.includes(activeFilters, element.getAttribute('data-declaring-structure'))) {
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

    var listItemText = document.createElement('span');
    listItemText.onclick = goToClassElement(symbol);
    listItemText.textContent = symbol.name;
    if (symbol.isPublic) {
      listItemText.classList.add('public');
    }
    listItem.appendChild(listItemText);

    var detailKeys = [
      'detailsType',
      'detailsDescription',
      'detailsLongDescription',
      'detailsParameters',
      'detailsReturnType'
    ];
    if(_.some(detailKeys, (d) => _.has(symbol, d))) {
      var listItemDetails = document.createElement('div');
      listItemDetails.classList.add('description-container');
      if(_.has(symbol, 'detailsDescription')) {
        var description = document.createElement('div');
        description.innerHTML = `
          <div class="detail-part-container">
            <div><strong>Description</strong></div>
            <div>${symbol.detailsDescription}</div>
          </div>
        `;
        listItemDetails.appendChild(description);
      }
      if(_.has(symbol, 'detailsType')) {
        var description = document.createElement('div');
        description.innerHTML = `
          <div class="detail-part-container">
            <div><strong>Type</strong></div>
            <div>${symbol.detailsType}</div>
          </div>
        `;
        listItemDetails.appendChild(description);
      }
      if(_.has(symbol, 'detailsLongDescription')) {
        var description = document.createElement('div');
        description.innerHTML = `
          <div class="detail-part-container">
            <div><strong>Full description</strong></div>
            <div>${symbol.detailsLongDescription}</div>
          </div>
        `;
        listItemDetails.appendChild(description);
      }
      if(_.has(symbol, 'detailsParameters')) {
        console.log(symbol.parameters);
        var description = document.createElement('div');
        var parameters = _.map(symbol.parameters, (p) => {
          return `
          <div class="detail-part-container">
            <div><strong>${p.type}</strong>${p.name}</div>
          </div>
          `;
        })
        description.innerHTML = `
          <div class="detail-part-container">
            <div><strong>Parameters</strong></div>
            <div class="parameters-list">
              ${parameters.join('')}
            </div>
          </div>
        `;
        listItemDetails.appendChild(description);
      }
      if(_.has(symbol, 'detailsReturnType')) {
        var description = document.createElement('div');
        description.innerHTML = `
          <div class="detail-part-container">
            <div><strong>Return type</strong></div>
            <div>${symbol.detailsReturnType}</div>
          </div>
        `;
        listItemDetails.appendChild(description);
      }

      var listItemShowDetails = document.createElement('a');
      listItemShowDetails.classList.add('show-item-details');
      listItemShowDetails.onclick = () => {
        listItemShowDetails.classList.toggle('active');
        listItemDetails.classList.toggle('active');
        listItem.classList.toggle('active');
      };
      listItem.appendChild(listItemShowDetails);
      listItem.appendChild(listItemDetails);
    }

    list.appendChild(listItem);
  });
  return list;
};

var createSymbolsLists = (classInfoModel, classInfoElement) => {
  var subListContainer = document.createElement('div');
  subListContainer.classList.add('list-container');
  subListContainer.appendChild(createDependenciesFilters(classInfoModel, classInfoElement));
  var subLists = [
    [classInfoModel.constants, 'constants-list', 'C'],
    [classInfoModel.staticProperties, 'static-properties-list', 'P'],
    [classInfoModel.staticMethods, 'static-methods-list', 'M'],
    [classInfoModel.properties, 'properties-list', 'P'],
    [classInfoModel.methods, 'methods-list', 'M']
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
