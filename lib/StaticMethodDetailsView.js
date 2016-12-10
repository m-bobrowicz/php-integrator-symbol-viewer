'use babel';

import _ from 'lodash';

module.exports = function StaticMethodDetailsView(staticMethod) {

    return `
        <div class="details">
            <h6><strong>Name</strong></h6>
            <p>${staticMethod.name}</p>
            <h6><strong>Declared in</strong></h6>
            <p>${staticMethod.declaringStructure.name}</p>
            ${_.isEmpty(staticMethod.parameters) ? `` : `
                <div class="parameters-list">
                    <h6><strong>Parameters</strong></h6>
                    ${_.map(staticMethod.parameters, (p) => `
                        <span>${_.map(p.types,(pp)=>`${pp.type}`)}
                            $${p.name} 
                        </span>
                    `).join('<br>')}
                </div>
            `}

            ${
                _.isEmpty(staticMethod.returnTypes) ? `` : `
                <div class="parameters-list">
                    <h6><strong>Returns</strong></h6>
                    ${_.map(staticMethod.returnTypes, (t) => `
                        <span>
                            ${t.type} $${t.resolvedType}
                        </span>
                    `)}
                </div>
            `}
            
            ${
                _.isNil(staticMethod.shortDescription)
                || _.isEmpty(staticMethod.shortDescription)? 
                `` :
                `<h6><strong>Description</strong></h6>
                <p>${staticMethod.shortDescription}</p>`
            }
        </div>
    `;
}
