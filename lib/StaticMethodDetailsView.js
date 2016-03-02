'use babel';

import _ from 'lodash';

module.exports = function StaticMethodDetailsView(staticMethod) {
    return `
        <div class="details">
            <h6>Name</h6>
            <p>${staticMethod.name}</p>
            <h6>Declared in</h6>
            <p>${staticMethod.declaringStructure.name}</p>
            ${_.isEmpty(staticMethod.parameters) ? `` : `
                <div class="parameters-list">
                    <h6>Parameters</h6>
                    ${_.map(staticMethod.parameters, (p) => `
                        <span>
                            ${p.type} $${p.name}
                        </span>
                    `)}
                </div>
            `}
            <h6>Returns</h6>
            <p>${staticMethod.return.resolvedType}</p>
            ${
                _.isNil(staticMethod.descriptions.short)
                || _.isEmpty(staticMethod.descriptions.short)? 
                `` :
                `<h6>Description</h6>
                <p>${staticMethod.descriptions.short}</p>`
            }
        </div>
    `;
}
