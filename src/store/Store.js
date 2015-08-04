'use strict';

import {ReplaySubject, Observable} from 'rx';

const publishState = Symbol('publishState');
const publishError = Symbol('publishError');

const observableSymbol = Symbol('observable');

class Store extends Observable {
    constructor(initialValue) {
        let replaySubject = new ReplaySubject(1);

        super(function (observer) {
            return this.subscribe(
                observer.onNext.bind(observer),
                observer.onError.bind(observer),
                observer.onCompleted.bind(observer)
            );
        }.bind(replaySubject));

        this[observableSymbol] = replaySubject;

        initialValue && Promise.resolve(initialValue)
            .then(value => {
                this.setState(value);
            })
            .catch(error => {
                this[publishError](error);
            });
    }

    setState(newState) {
        this.state = newState;
        this[publishState]();
    }

    getState() {
        return this.state;
    }

    setSource(observableSource) {
        observableSource.subscribe(
            (value) => this.setState(value),
            (error) => this[publishError]('Rethrown error from source: ' + error)
        );
    }

    /******************************************************************************************************************
     * Private methods
     *****************************************************************************************************************/

    [publishState]() {
        return this[observableSymbol].onNext(this.state);
    }

    [publishError](error) {
        return this[observableSymbol].onError(error);
    }

    /******************************************************************************************************************
     * Static methods
     *****************************************************************************************************************/

    static create(storeConfig) {
        let initialState;
        let mergeObject = {};

        if (storeConfig) {
            if (storeConfig.getInitialValue) {
                initialState = storeConfig && storeConfig.getInitialState();
            }

            Object.keys(storeConfig)
                .filter(keyName => keyName !== 'getInitialState')
                .forEach(keyName => {
                    mergeObject[keyName] = storeConfig[keyName];
                    return mergeObject;
                });
        }

        return Object.assign(new Store(initialState), mergeObject);
    }
}

export default Store;
