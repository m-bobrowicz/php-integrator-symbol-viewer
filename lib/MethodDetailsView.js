'use babel';

import _ from 'lodash';

module.exports = function MethodDetailsView(method) {

    return `
        <div class="details">
            <h6><strong>Name</strong></h6>
            <p>${method.name}</p>
            <h6><strong>Declared in</strong></h6>
            <p>${method.declaringStructure.name}</p>
            ${_.isEmpty(method.parameters) ? `` : `
                <p class="parameters-list">
                    <h6><strong>Parameters</strong></h6>
                    ${_.map(method.parameters, (p) => `
                        <span>
                            ${p.type} $${p.name}
                        </span>
                    `).join('<br>')}
                </p>
            `}

            ${
                _.isEmpty(method.returnTypes) ? `` : `
                <p class="parameters-list">
                    <h6><strong>Returns</strong></h6>
                    ${_.map(method.returnTypes, (r) => `
                        <span>
                            ${r.type} $${r.resolvedType}
                        </span>
                    `)}
                </p>
            `}

            ${
                _.isNil(method.shortDescription)
                || _.isEmpty(method.shortDescription)?
                `` :
                `<h6><strong>Description</strong></h6>
                <p>${method.shortDescription}</p>`
            }
        </div>
    `;
}
