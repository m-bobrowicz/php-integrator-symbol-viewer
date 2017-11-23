'use babel';

import _ from 'lodash';

module.exports = function ConstantDetailsView(constant) {
    return `
        <div class="details">
            <h6>Name</h6>
            <p>${constant.name}</p>
            <h6>Type</h6>
            <p>${_.map(constant.types, 'resolvedType').join(', ')}</p>
            <h6>Declared in</h6>
            <p>${constant.declaringStructure.fqcn}</p>
            ${_.isNil(constant.shortDescriptions) ? `` : `
                <h6>Description</h6>
                <p>${constant.shortDescriptions}</p>
            `}
        </div>
    `;
}
