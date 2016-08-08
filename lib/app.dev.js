'use strict';
'use babel';

import { run } from '@cycle/rxjs-run';
import { makeDOMDriver } from '@cycle/dom';
import SymbolViewer from './components/symbol-viewer';

run(SymbolViewer, {
  DOM: makeDOMDriver('.symbol-viewer', { transposition: true }),
  goToDefinition: (goToDefinition$) => goToDefinition$.subscribe(
      value => console.log(value),
      value => console.log(value)
  )
});
