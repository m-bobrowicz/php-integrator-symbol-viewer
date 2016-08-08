'use strict';

import Rx from 'rxjs';
import { div, select, option, span, ul, li, input, label, button } from '@cycle/dom';
import classList$ from './../sample-data.stream';
import FigureSelector from './figure-selector';
import ShowInherited from './show-inherited';

export default function SymbolViewer(sources) {
  const figureSelector = FigureSelector({
    DOM: sources.DOM,
    classList: classList$,
  });
  const showInherited = ShowInherited({
    DOM: sources.DOM,
    classList: classList$,
  });

  const searchQuery$ = sources.DOM
    .select('input[type="text"]')
    .events('keyup')
    .map(ev => ev.target.value)
    .startWith('');

  const openProperty$ = sources.DOM
    .select('button.open-property')
    .events('click')
    .map(ev => ev.target.dataset.propertyId)
    .startWith('');

  const goToDefinition$ = sources.DOM
    .select('button.go-to-definition')
    .events('click')
    .map(ev => ev.target.dataset.propertyId)
    .startWith('');

  return {
    DOM: getModelStream().map(render),
    goToDefinition: goToDefinition$
  };

  function getModelStream() {
      const initialModel = {
          openProperties: {},
      };
      return Rx.Observable
        .combineLatest(
            classList$,
            figureSelector.selectedClass,
            figureSelector.DOM,
            showInherited.showInherited,
            showInherited.DOM,
            searchQuery$,
            openProperty$
        )
        .scan((
            oldModel,
            [
                classList,
                selectedClass,
                figureSelectorVDom,
                showInheritedProperties,
                showInheritedVDom,
                searchQuery,
                openProperty
            ]
        ) => {
            const properties = Object.keys(selectedClass.properties)
                .map(key => selectedClass.properties[key])
                .map(p => {
                    p.isInherited = false;
                    if(p.declaringStructure) {
                        p.isInherited = p.declaringStructure.name !== selectedClass.name;
                    }
                    return p;
                })
                .filter(p => showInheritedProperties || !p.isInherited)
                .filter(p => !searchQuery || p.name.indexOf(searchQuery) > -1);
            oldModel.openProperties[openProperty] = !oldModel.openProperties[openProperty];
            return [
                {
                    name: selectedClass.name,
                    options: classList,
                    selectedClass,
                    properties,
                    showInheritedProperties,
                    searchQuery,
                    openProperties: oldModel.openProperties,
                },
                {
                    'figure-selector': figureSelectorVDom,
                    'show-inherited': showInheritedVDom,
                },
            ];
        }, initialModel);

  }

  function render([model, vdom]) {
      return div([
          vdom['figure-selector'],
          div([
              ul(
                  Object
                    .keys(model.properties)
                    .map(key => model.properties[key])
                    .map(p => {
                        return li([
                            p.name,
                            button({ attrs: { 'class': 'open-property', 'data-property-id': p.name } }, ['open']),
                            button({ attrs: { 'class': 'go-to-definition', 'data-property-id': p.name } }, ['go to definition']),
                            model.openProperties[p.name] ? 'Open' : 'Closed'
                        ]);
                    })
              ),
          ]),
          div([
              label([
                  'Search',
                  input({ attrs: { type: 'text', value: model.searchQuery } }),
              ]),
          ]),
          vdom['show-inherited']
      ]);
  }
}
