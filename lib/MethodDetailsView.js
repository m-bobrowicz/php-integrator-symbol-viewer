'use babel';

import _ from 'lodash';

module.exports = function MethodDetailsView(method) {
    return `
        <div class="details">
            <h6>Name</h6>
            <p>${method.name}</p>
            <h6>Declared in</h6>
            <p>${method.declaringStructure.name}</p>
            ${_.isEmpty(method.parameters) ? `` : `
                <div class="parameters-list">
                    <h6>Parameters</h6>
                    ${_.map(method.parameters, (p) => `
                        <span>
                            ${p.type} $${p.name}
                        </span>
                    `)}
                </div>
            `}
            <h6>Returns</h6>
            <p>
                ${_.map(method.returnTypes, 'resolvedType').join(', ')}
            </p>
            ${
                _.isNil(method.shortDescription)
                || _.isEmpty(method.shortDescription)?
                `` :
                `<h6>Description</h6>
                <p>${method.shortDescription}</p>`
            }
        </div>
    `;
}
