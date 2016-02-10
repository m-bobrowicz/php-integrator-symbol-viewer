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
  this.constants = parseOwnSymbols(classInfo.constants, true).map((s) => {
    var descriptionParts = {};
    if(s.descriptions.short) {
      descriptionParts['detailsDescription'] = s.descriptions.short;
    }
    if(s.descriptions.long) {
      descriptionParts['detailsLongDescription'] = s.descriptions.long;
    }
    if(s.return.resolvedType) {
      descriptionParts['detailsType'] = s.return.resolvedType;
    }
    return _.assign(s, descriptionParts);
  });
  this.staticProperties = parseOwnSymbols(classInfo.properties, true).map((s) => {
    var descriptionParts = {};
    if(s.descriptions.short) {
      descriptionParts['detailsDescription'] = s.descriptions.short;
    }
    if(s.descriptions.long) {
      descriptionParts['detailsLongDescription'] = s.descriptions.long;
    }
    if(s.return.resolvedType) {
      descriptionParts['detailsType'] = s.return.resolvedType;
    }
    return _.assign(s, descriptionParts);
  });
  this.staticMethods = parseOwnSymbols(classInfo.methods, true);
  this.properties = parseOwnSymbols(classInfo.properties, false).map((s) => {
    var descriptionParts = {};
    if(s.descriptions.short) {
      descriptionParts['detailsDescription'] = s.descriptions.short;
    }
    if(s.descriptions.long) {
      descriptionParts['detailsLongDescription'] = s.descriptions.long;
    }
    if(s.return.resolvedType) {
      descriptionParts['detailsType'] = s.return.resolvedType;
    }
    return _.assign(s, descriptionParts);
  });
  this.methods = parseOwnSymbols(classInfo.methods, false).map((s) => {
    var descriptionParts = {};
    if(s.descriptions.short) {
      descriptionParts['detailsDescription'] = s.descriptions.short;
    }
    if(s.descriptions.long) {
      descriptionParts['detailsLongDescription'] = s.descriptions.long;
    }
    if(s.parameters.length > 0) {
      descriptionParts['detailsParameters'] = s.parameters;
    }
    if(s.return.resolvedType) {
      descriptionParts['detailsReturnType'] = s.return.resolvedType;
    }
    return _.assign(s, descriptionParts);
  });
}
