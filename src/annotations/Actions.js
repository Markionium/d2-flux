'use strict';

import Dispatcher from '../dispatcher/Dispatcher';
import {camelToUnderscore, createSymbolOnObjectForKey} from '../utils';
import {log} from '../index';

function Actions(ClassConstructor) {
    function dispatchActionResult(propertyName, actionResult) {
        Dispatcher.dispatch({
            type: this[camelToUnderscore(propertyName)],
            data: actionResult
        });
    }

    return class Actions extends (ClassConstructor) { //eslint-disable-line no-shadow
        constructor() {
            super();

            let actionsInstance = Object.getPrototypeOf(Object.getPrototypeOf(this));

            Object.getOwnPropertyNames(actionsInstance)
                .filter(propertyName => propertyName !== 'constructor')
                .map(propertyName => {
                    this[propertyName] = function (...args) {
                        Promise.resolve(actionsInstance[propertyName](...args))
                            .then(dispatchActionResult.bind(this, propertyName))
                            .catch(error => {
                                log.error('Error dispatching action', error);
                            });
                    }.bind(this);

                    return propertyName;
                })
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
