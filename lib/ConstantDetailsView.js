'use babel';

import _ from 'lodash';

module.exports = function ConstantDetailsView(constant) {
    return `
        <div class="details">
            <h6><strong>Name</strong></h6>
            <p>${constant.name}</p>

            ${
                _.isEmpty(constant.types) ? `` : `
                <p>
                    <h6><strong>Type</strong></h6>
                    ${_.map(constant.types, (t) => `
                        <span>
                            ${t.type} $${t.resolvedType}
                        </span>
                    `)}
                </p>
            `}

            <h6><strong>Declared in</strong></h6>
            <p>${constant.declaringStructure.name}</p>

            ${_.isNil(constant.shortDescription) ? `` : `
                <h6><strong>Description</strong></h6>
                <p>${constant.shortDescription}</p>
            `}
        </div>
    `;
}
