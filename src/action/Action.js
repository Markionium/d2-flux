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
const Action = {
    /**
     * @method create
     *
     * @param {String} [name=AnonymousAction]
     *
     * @description
     * A name can be provided that will be used to generate the Action.id Symbol identifier.
     */
    create(name = 'AnonymousAction') {
        const subject = Object.assign(
            (...actionArgs) => {
                logLevel.info('Firing action: ' + subject.id.toString());

                return Observable.fromPromise(new Promise((resolve, reject) => {
                    subject.onNext({
                        //Pass one argument if there is just one else pass the arguments as an array
                        data: actionArgs.length === 1 ? actionArgs[0] : [...actionArgs],
                        //Callback to complete the action
                        complete: (...args) => {
                            resolve(...args);
                            logLevel.info('Completed action: ' + subject.id.toString());
                        },
                        //Callback to error the action
                        error: (...args) => {
                            reject(...args);
                            logLevel.warn('Errored action: ' + subject.id.toString());
                        }
                    });
                }));
            },
            Observable.prototype,
            Subject.prototype
        );

        Object.defineProperty(subject, 'id', {value: Symbol(name)});

        Subject.call(subject);

        return subject;
    },

    /**
     * @method createActionsFromNames
     *
     * @param {String[]} [actionNames=[]] Names of the actions to create.
     * @param {String} [prefix] Prefix to prepend to all the action identifiers.
     *
     * @returns {{}}
     *
     * @description
     * Returns an object with the given names as keys and instanced of the Action class as actions.
     */
    createActionsFromNames(actionNames = [], prefix = undefined) {
        let actions = {};

        if (prefix && isString(prefix)) {
            prefix = prefix + '.';
        } else {
            prefix = '';
        }

        actionNames.forEach(actionName => {
            actions[actionName] = this.create(prefix + actionName);
        });

        return actions;
    }
};

export default Action;
