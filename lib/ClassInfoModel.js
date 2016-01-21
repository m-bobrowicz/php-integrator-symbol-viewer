'use babel';

import _ from 'lodash'

module.exports = function ClassInfoModel(classInfo) {
    this.type = classInfo.type;
    this.shortName = classInfo.shortName;
    this.constants = _(classInfo.constants)
        .values()
        .sortBy('name')
        .value();
    this.properties = _(classInfo.properties)
        .values()
        .sortBy('name')
        .value();
    this.staticMethods = _(classInfo.methods)
        .values()
        .filter((m) => m.isStatic)
        .sortBy('name')
        .sortBy((m) => m.isPublic ? -1 : 1)
        .sortBy((m) => m.isPrivate ? -1 : 1)
        .value();
    this.methods = _(classInfo.methods)
        .values()
        .filter((m) => !m.isStatic)
        .sortBy('name')
        .sortBy((m) => m.isPublic ? -1 : 1)
        .sortBy((m) => m.isPrivate ? -1 : 1)
        .sortBy((m) => m.name.search(/^[gs]et[A-Z]/) == 0 ? 1 : -1 )
        .sortBy((m) => m.name.search(/^__/) == 0 ? 1 : -1)
        .value();
}
