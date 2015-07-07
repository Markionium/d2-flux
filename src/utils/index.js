'use strict';

export function camelToUnderscore(propertyName) {
    return propertyName.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

export function createSymbolOnObjectForKey(key) {
    this[key] = Symbol(key);
}
