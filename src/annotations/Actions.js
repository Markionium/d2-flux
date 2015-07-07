'use strict';

import {camelToUnderscore, createSymbolOnObjectForKey} from '../utils';
import {log} from '../index';

function Actions(ClassConstructor) {
    return class Actions extends (ClassConstructor) { //eslint-disable-line no-shadow
        constructor() {
            super();

            let actionsInstance = Object.getPrototypeOf(Object.getPrototypeOf(this));

            Object.getOwnPropertyNames(actionsInstance)
                .filter(propertyName => propertyName !== 'constructor')
                .map(camelToUnderscore)
                .map(property => {
                    log.debug('Creating Symbol property ', property, 'on', ClassConstructor.name);
                    return property;
                })
                .forEach(createSymbolOnObjectForKey, this);
        }
    };
}

export default Actions;
