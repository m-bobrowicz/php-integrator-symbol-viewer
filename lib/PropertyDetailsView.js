'use babel';

import _ from 'lodash';

module.exports = function PropertyDetailsView(property) {

    return `
        <div class="details">
            <h6><strong>Name</strong></h6>
            <p>${property.name}</p>
            
            ${
                _.isEmpty(property.types) ? `` : `
                <p>
                    <h6><strong>Type</strong></h6>
                    ${_.map(property.types, (t) => `
                        <span>
                            ${t.type} $${t.resolvedType}
                        </span>
                    `)}
                </p>
            `}

            <h6><strong>Declared in</strong></h6>
            <p>${property.declaringStructure.name}</p>
            
            ${_.isNil(property.shortDescription) ? `` : `
                <h6><strong>Description</strong></h6>
                <p>${property.shortDescription}</p>
            `}
        </div>
    `;
}
