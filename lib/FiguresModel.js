'use babel';

import _ from 'lodash';

class Figure {
    constructor(rawFigure) {
        this.name = rawFigure.name;
        this.shortName = rawFigure.shortName;
        this.type = rawFigure.type;
        this.constants = _(rawFigure.constants)
            .values()
            .value();
        this.staticProperties = _(rawFigure.properties)
            .filter('isStatic')
            .value();
        this.staticMethods = _(rawFigure.methods)
            .filter('isStatic')
            .value();
        this.properties = _(rawFigure.properties)
            .reject('isStatic')
            .value();
        this.methods = _(rawFigure.methods)
            .reject('isStatic')
            .value();
    }
}

module.exports = class FiguresModel extends Array {
    constructor(rawFigures) {
        super();

        _(rawFigures)
            .values()
            .map((rawFigure) => new Figure(rawFigure))
            .each((f) => this.push(f));
    }
}
