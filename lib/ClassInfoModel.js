'use babel';

import _ from 'lodash'

var pluckAndSort = (elements, onlyStatic) => _(elements)
  .values()
  .filter((element) => {
    if(onlyStatic) {
      return element.isStatic;
    }
    return !element.isStatic;
  })
  .sortBy('name')
  .value();

module.exports = function ClassInfoModel(classInfo) {
    this.type = classInfo.type;
    this.shortName = classInfo.shortName;
    this.constants = pluckAndSort(classInfo.constants, true);
    this.staticProperties = pluckAndSort(classInfo.properties, true);
    this.staticMethods = pluckAndSort(classInfo.methods, true);
    this.properties = pluckAndSort(classInfo.properties, false);
    this.methods = pluckAndSort(classInfo.methods, false);
}
