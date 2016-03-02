'use babel';

import _ from 'lodash';

module.exports = function StaticPropertyDetailsView(staticProperty) {
    return `
        <div class="details">
            <h6>Name</h6>
            <p>${staticProperty.name}</p>
            <h6>Type</h6>
            <p>${staticProperty.return.resolvedType}</p>
            <h6>Declared in</h6>
            <p>${staticProperty.declaringStructure.name}</p>
            ${_.isNil(staticProperty.descriptions.short) ? `` : `
                <h6>Description</h6>
                <p>${staticProperty.descriptions.short}</p>
            `}
        </div>
    `;
}
