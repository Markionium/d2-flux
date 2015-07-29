'use strict';

import isString from 'lodash.isstring';

import {Subject, Observable} from 'rx';
import logLevel from 'loglevel';

/**
 * @class Action
 * @extends Rx.Subject
 *
 * @description
 * Action is an observable that can be subscribed to. When a action is executed all subscribers
 * to the action will receive a notification.
 *
 * @see https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/subject.md
 *
 */
class Action extends Subject {
    /**
     * @constructor
     *
     * @param {String} [name=AnonymousAction]
     *
     * @description
     * A name can be provided that will be used to generate the Action.id Symbol identifier.
     */
    constructor(name = 'AnonymousAction') {
        super();

        Object.defineProperty(this, 'id', {value: Symbol(name)});

        this.execute = (value) => {
            logLevel.info('Firing action: ' + this.id.toString());

            return Observable.fromPromise(new Promise((resolve, reject) => {
                this.onNext({value: value, complete: resolve, error: reject});
            }));
        };
    }

    /**
     * @method createActionsFromNames
     * @static
     *
     * @param {String[]} [actionNames=[]] Names of the actions to create.
     * @param {String} [prefix] Prefix to prepend to all the action identifiers.
     *
     * @returns {{}}
     *
     * @description
     * Returns an object with the given names as keys and instanced of the Action class as actions.
     */
    static createActionsFromNames(actionNames = [], prefix = undefined) {
        let actions = {};

        if (prefix && isString(prefix)) {
            prefix = prefix + '.';
        } else {
            prefix = '';
        }

        actionNames.forEach(actionName => {
            actions[actionName] = new this(prefix + actionName);
        });

        return actions;
    }
}

export default Action;
