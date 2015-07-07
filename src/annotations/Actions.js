'use strict';

import {camelToUnderscore, createSymbolOnObjectForKey} from '../utils';

function Actions(ClassConstructor) {
    return class Actions extends (ClassConstructor) { //eslint-disable-line no-shadow
        constructor() {
            super();

            let actionsInstance = Object.getPrototypeOf(Object.getPrototypeOf(this));

            Object.getOwnPropertyNames(actionsInstance)
                .filter(propertyName => propertyName !== 'constructor')
                .map(camelToUnderscore)
                .forEach(createSymbolOnObjectForKey, this);
        }
    };
}

export default Actions;
