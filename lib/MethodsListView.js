'use babel';

import _ from 'lodash';
import MethodDetailsView from './MethodDetailsView';

module.exports = function MethodsListView(methods, currentFigureName) {
    return _.isEmpty(methods) ? `` : `
        <div class="list methods-list">
            ${_.map(methods, (method) => `
                <div
                    class="list-element"
                    data-name="${method.name}"
                    data-current-structure="${currentFigureName}"
                    data-declaring-structure-name="${method.declaringStructure.name}"
                    data-declaring-structure-file="${method.declaringStructure.filename}"
                    data-declaring-structure-line="${method.declaringStructure.startLineMember}">
                    <div class="title">
                        <div class="inherited ${currentFigureName !== method.declaringStructure.name ? `active` : ``}"></div>
                        <div class="bullet">M</div>
                        <div class="name">
                            ${method.name}
                        </div>
                        <div class="info"></div>
                    </div>
                    ${MethodDetailsView(method)}
                </div>
            `).join('')}
        </div>
    `;
}
