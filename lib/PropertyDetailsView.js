'use babel';

import _ from 'lodash';

module.exports = function PropertyDetailsView(property) {
    return `
        <div class="details">
            <h6>Name</h6>
            <p>${property.name}</p>
            <h6>Type</h6>
            <p>
                ${_.map(property.types, (type) => `
                    ${type.resolvedType}
                `).join(`, `)}
            </p>
            <h6>Declared in</h6>
            <p>${property.declaringStructure.name}</p>
            ${_.isNil(property.shortDescription) ? `` : `
                <h6>Description</h6>
                <p>${property.shortDescription}</p>
            `}
        </div>
    `;
}
