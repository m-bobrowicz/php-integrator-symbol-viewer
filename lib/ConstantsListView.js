'use babel';

import _ from 'lodash';
import ConstantDetailsView from './ConstantDetailsView';

module.exports = function ConstantsListView(constants, currentFigureName) {
    return _.isEmpty(constants) ? `` : `
        <div class="list constants-list">
            ${_.map(constants, (constant) => `
                <div
                    class="list-element"
                    data-name="${constant.name}"
                    data-current-structure="${currentFigureName}"
                    data-declaring-structure-name="${constant.declaringStructure.name}"
                    data-declaring-structure-file="${constant.declaringStructure.filename}"
                    data-declaring-structure-line="${constant.declaringStructure.startLineMember}">
                    <div class="title">
                        <div class="inherited ${currentFigureName !== constant.declaringStructure.name ? `active` : ``}"></div>
                        <div class="bullet">C</div>
                        <div class="name">
                            ${constant.name}
                        </div>
                        <div class="info"></div>
                    </div>
                    ${ConstantDetailsView(constant)}
                </div>
            `).join('')}
        </div>
    `;
}
