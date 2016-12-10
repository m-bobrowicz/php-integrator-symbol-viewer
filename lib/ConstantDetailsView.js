'use babel';

import _ from 'lodash';

module.exports = function ConstantDetailsView(constant) {
    return `
        <div class="details">
            <h6>Name</h6>
            <p>${constant.name}</p>
            <h6>Type</h6>
            <p>${constant.resolvedTypes}</p>
            <h6>Declared in</h6>
            <p>${constant.declaringStructure.name}</p>
            ${_.isNil(constant.shortDescription) ? `` : `
                <h6>Description</h6>
                <p>${constant.shortDescription}</p>
            `}
        </div>
    `;
}
