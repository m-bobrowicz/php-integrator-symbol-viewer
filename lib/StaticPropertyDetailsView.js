'use babel';

import _ from 'lodash';

module.exports = function StaticPropertyDetailsView(staticProperty) {
    console.log(staticProperty);
    return `
        <div class="details">
            <h6><strong>Name</strong></h6>
            <p>${staticProperty.name}</p>

            ${
                _.isEmpty(staticProperty.types) ? `` : `
                <div class="parameters-list">
                    <h6>Type</h6>
                    ${_.map(staticProperty.types, (t) => `
                        <span>
                            ${t.type} $${t.resolvedType}
                        </span>
                    `)}
                </div>
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
