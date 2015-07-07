'use strict';

import {Dispatcher} from 'flux';
import {log} from '../index';

class D2FluxDispatcher extends Dispatcher {
    register(...args) {
        log.debug('Registering callback with dispatcher: ', args[0].toString());

        return super.register(...args);
    }

    dispatch(...args) {
        let [{type}] = args;

        if (!type) {
            throw new Error('Dispatcher: Action type can not be undefined');
        }

        log.debug('Dispatching event: ', args);
        return super.dispatch(...args);
    }
}

export default new D2FluxDispatcher();
