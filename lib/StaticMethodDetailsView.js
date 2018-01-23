'use babel';

import _ from 'lodash';

module.exports = function StaticMethodDetailsView(staticMethod) {
    return `
        <div class="details">
            <h6>Name</h6>
            <p>${staticMethod.name}</p>
            <h6>Declared in</h6>
            <p>${staticMethod.declaringStructure.fqcn}</p>
            ${_.isEmpty(staticMethod.parameters) ? `` : `
                <div class="parameters-list">
                    <h6>Parameters</h6>
                    ${_.map(staticMethod.parameters, (p) => `
                        <span>
                            ${_.map(p.types, 'resolvedType').join(', ')} $${p.name}
                        </span>
                    `)}
                </div>
            `}
            <h6>Returns</h6>
            <p>${staticMethod.returnTypes.length > 0 ? staticMethod.returnTypes[0].resolvedType : ''}</p>
            ${
                _.isNil(staticMethod.shortDescription)
                || _.isEmpty(staticMethod.shortDescription)?
                `` :
                `<h6>Description</h6>
                <p>${staticMethod.shortDescription}</p>`
            }
        </div>
    `;
}
