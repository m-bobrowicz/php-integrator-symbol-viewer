'use babel';

import _ from 'lodash'

var parseOwnSymbols = (symbols, onlyStatic = false) =>
  _(symbols)
  .values()
  .filter((symbol) => {
    if (onlyStatic) {
      return symbol.isStatic;
    }
    return !symbol.isStatic;
  })
  .sortBy('name')
  .value();

var parseDependencies = ({
    constants, properties, methods, name
  }) =>
  _([constants, properties, methods])
  .flatMap(_.values)
  .filter(s => s.declaringStructure.name !== name)
  .groupBy(s => '' + s.declaringStructure.type.toUpperCase()[0] + '-' + s.declaringStructure.name)
  .keys()
  .map(d => d.split('-'))
  .map(([bulletChar, name]) => ({
    bulletChar,
    name,
    shortName: _.last(name.split('\\'))
  }))
  .sortBy(({
    bulletChar, shortName
  }) => bulletChar + shortName)
  .value();

module.exports = function ClassInfoModel(classInfo) {
  this.type = classInfo.type.toUpperCase()[0];
  this.dependencies = parseDependencies(classInfo);
  this.shortName = classInfo.shortName;
  this.parents = classInfo.parents;
  this.constants = parseOwnSymbols(classInfo.constants, true);
  this.staticProperties = parseOwnSymbols(classInfo.properties, true);
  this.staticMethods = parseOwnSymbols(classInfo.methods, true);
  this.properties = parseOwnSymbols(classInfo.properties, false);
  this.methods = parseOwnSymbols(classInfo.methods, false);
}
