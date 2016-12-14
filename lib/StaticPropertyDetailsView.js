'use babel';

import _ from 'lodash';

module.exports = function StaticPropertyDetailsView(staticProperty) {

    return `
        <div class="details">
            <h6><strong>Name</strong></h6>
            <p>${staticProperty.name}</p>

            ${
                _.isEmpty(staticProperty.types) ? `` : `
                <p>
                    <h6><strong>Type</strong></h6>
                    ${_.map(staticProperty.types, (t) => `
                        <span>
                            ${t.type} $${t.resolvedType}
                        </span>
                    `)}
                </p>
            `}

            <h6><strong>Declared in</strong></h6>
            <p>${staticProperty.declaringStructure.name}</p>

            ${_.isNil(staticProperty.shortDescription) ? `` : `
                <h6><strong>Description</strong></h6>
                <p>${staticProperty.shortDescription}</p>
            `}
        </div>
    `;
}
