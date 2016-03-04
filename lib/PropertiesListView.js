'use babel';

import _ from 'lodash';
import PropertyDetailsView from './PropertyDetailsView';

module.exports = function PropertiesListView(properties, currentFigureName) {
    return _.isEmpty(properties) ? `` : `
        <div class="list properties-list">
            ${_.map(properties, (property) => `
                <div
                    class="list-element"
                    data-name="${property.name}"
                    data-current-structure="${currentFigureName}"
                    data-declaring-structure-name="${property.declaringStructure.name}"
                    data-declaring-structure-file="${property.declaringStructure.filename}"
                    data-declaring-structure-line="${property.declaringStructure.startLineMember}">
                    <div class="title">
                        <div class="inherited ${currentFigureName !== property.declaringStructure.name ? `active` : ``}"></div>
                        <div class="bullet">P</div>
                        <div class="name">
                            ${property.name}
                        </div>
                        <div class="info"></div>
                    </div>
                    ${PropertyDetailsView(property)}
                </div>
            `).join('')}
        </div>
    `;
}
