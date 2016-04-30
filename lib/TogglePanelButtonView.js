'use babel';

import _ from 'lodash';

module.exports = function TogglePanelButtonView(container, togglePanelCallback) {
    container.innerHTML = `
        <div class="toggle-button-container">
            <div class="toggle-button"></div>
        </div>
    `;
    container
        .querySelector('.toggle-button-container .toggle-button')
        .onclick = togglePanelCallback;
}
