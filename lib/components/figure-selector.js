import Rx from 'rxjs';
import { div, select, option, span, ul, li, input, label, button } from '@cycle/dom';

export default function FigureSelector(sources) {
  const selectedShortName$ = sources.DOM
    .select('select')
    .events('change')
    .map(ev => ev.target.value)
    .startWith(null);

  const modelStream$ = Rx.Observable.combineLatest(sources.classList, selectedShortName$);
  return {
    DOM: modelStream$
        .map(([classList, selectedShortName]) => {
            console.log(classList);
            const selectedClass = findByShortName(classList, selectedShortName || classList[0].shortName);
            return {
                options: classList
            }
        })
        .map(render),
    selectedClass: modelStream$
        .map(([classList, selectedShortName]) => {
            return findByShortName(classList, selectedShortName || classList[0].shortName);
        })
  };

  function render(model) {
      return div([
          select(model.options.map(
              so => option(so.shortName)
          )),
      ]);
  }

  function findByShortName(classList, shortName) {
      return classList.find(c => c.shortName === shortName);
  }
}
