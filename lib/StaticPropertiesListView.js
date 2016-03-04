'use babel';

import _ from 'lodash';
import StaticPropertyDetailsView from './StaticPropertyDetailsView';

module.exports = function StaticPropertiesListView(staticProperties, currentFigureName) {
    return _.isEmpty(staticProperties) ? `` : `
        <div class="list static-properties-list">
            ${_.map(staticProperties, (staticProperty) => `
                <div
                    class="list-element"
                    data-name="${staticProperty.name}"
                    data-current-structure="${currentFigureName}"
                    data-declaring-structure-name="${staticProperty.declaringStructure.name}"
                    data-declaring-structure-file="${staticProperty.declaringStructure.filename}"
                    data-declaring-structure-line="${staticProperty.declaringStructure.startLineMember}">
                    <div class="title">
                        <div class="inherited ${currentFigureName !== staticProperty.declaringStructure.name ? `active` : ``}"></div>
                        <div class="bullet">SP</div>
                        <div class="name">
                            ${staticProperty.name}
                        </div>
                        <div class="info"></div>
                    </div>
                    ${StaticPropertyDetailsView(staticProperty)}
                </div>
            `).join('')}
        </div>
    `;
}
