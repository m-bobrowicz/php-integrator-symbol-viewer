'use babel';

import _ from 'lodash';

module.exports = function StaticPropertyDetailsView(staticProperty) {
    return `
        <div class="details">
            <h6>Name</h6>
            <p>${staticProperty.name}</p>
            <h6>Type</h6>
            <p>${_.map(staticProperty.types, 'resolvedType').join(', ')}</p>
            <h6>Declared in</h6>
            <p>${staticProperty.declaringStructure.fqcn}</p>
            ${_.isNil(staticProperty.shortDescription) ? `` : `
                <h6>Description</h6>
                <p>${staticProperty.shortDescription}</p>
            `}
        </div>
    `;
}
