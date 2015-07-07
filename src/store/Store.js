'use strict';

import {ReplaySubject} from 'rx';

class Store extends ReplaySubject {
    constructor(initialState) {
        super(1);

        if (initialState) {
            this.state = initialState;
            this.emitState();
        }
    }

    emitState() {
        return this.onNext(this.state);
    }

    setState(newState) {
        this.state = newState;
        this.emitState();
    }

    getState() {
        return this.state;
    }
}

export default Store;
