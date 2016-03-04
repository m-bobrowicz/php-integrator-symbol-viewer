'use babel';

module.exports = function FiguresView(figuresModel) {
    var container = document.createElement('atom-php-integrator-symbol-viewer');
    container.innerHTML = `
        <div class="empty-view-container">
            <div class="empty-view-title">
                <span class="warning"></span>
                There is no data to be displayed.
            </div>
            <div class="empty-view-content">
                If you're seeing this message, but there
                are classes, interfaces or traits present
                in the current file please report this issue.
            </div>
        </div>
    `;

    return container;
}
