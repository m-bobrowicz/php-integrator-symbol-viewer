'use babel';

import _ from 'lodash';
import StaticMethodDetailsView from './StaticMethodDetailsView';

module.exports = function StaticMethodsListView(staticMethods, currentFigureName) {
    return _.isEmpty(staticMethods) ? `` : `
        <div class="list static-methods-list">
            ${_.map(staticMethods, (staticMethod) => `
                <div
                    class="list-element"
                    data-name="${staticMethod.name}"
                    data-current-structure="${currentFigureName}"
                    data-declaring-structure-name="${staticMethod.declaringStructure.name}"
                    data-declaring-structure-file="${staticMethod.declaringStructure.filename}"
                    data-declaring-structure-line="${staticMethod.declaringStructure.startLineMember}">
                    <div class="title">
                        <div class="inherited ${currentFigureName !== staticMethod.declaringStructure.name ? `active` : ``}"></div>
                        <div class="bullet">SM</div>
                        <div class="name">
                            ${staticMethod.name}
                        </div>
                        <div class="info"></div>
                    </div>
                    ${StaticMethodDetailsView(staticMethod)}
                </div>
            `).join('')}
        </div>
    `;
}
