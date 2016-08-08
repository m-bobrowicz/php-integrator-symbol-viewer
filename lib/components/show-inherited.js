import Rx from 'rxjs';
import { div, select, option, span, ul, li, input, label, button } from '@cycle/dom';

export default function ShowInherited(sources) {
 const showInheritedProperties$ = sources.DOM
   .select('input[type="checkbox"]')
   .events('change')
   .map(ev => ev.target.checked)
   .startWith(false);

  return {
    DOM: Rx.Observable.of([]).map(render),
    showInherited: showInheritedProperties$
  };

  function render(model) {
      return div([
        label([
            input({ attrs: { type: 'checkbox', checked: model.showInheritedProperties } }),
            'Show inherited properties',
        ]),
        ]);
  }

  function findByShortName(classList, shortName) {
      return classList.find(c => c.shortName === shortName);
  }
}
