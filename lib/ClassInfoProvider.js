'use babel';

import _ from 'lodash'
import ClassInfoModel from './ClassInfoModel';

module.exports = class ClassInfoProvider {
    constructor(service) {
        this.service = service;
    }

    getClassInfo(editor) {
        var fullClassName = this.service.determineFullClassName(editor);
        return new ClassInfoModel(this.service.getClassInfo(fullClassName));
    }
}
