'use babel';

import _ from 'lodash';

module.exports = function PropertyDetailsView(property) {
    console.log(property);
    return `
        <div class="details">
            <h6>Name</h6>
            <p>${property.name}</p>
            
            ${
                _.isEmpty(property.types) ? `` : `
                <div class="parameters-list">
                    <h6><strong>Type</strong></h6>
                    ${_.map(property.types, (t) => `
                        <span>
                            ${t.type} $${t.resolvedType}
                        </span>
                    `)}
                </div>
            `}

            <h6>Declared in</h6>
            <p>${property.declaringStructure.name}</p>
            ${_.isNil(property.shortDescription) ? `` : `
                <h6><strong>Description</strong></h6>
                <p>${property.shortDescription}</p>
            `}
        </div>
    `;
}
