'use strict';

import {log, Action as D2Action, Store as D2Store} from '../src/index';
import Action from '../src/action/Action';
import Store from '../src/action/Action';

describe('D2-Flux', () => {
    it('should have a log property', () => {
        expect(log).to.not.be.undefined;
    });

    it('should have the setLevel method', () => {
        expect(log.setLevel).to.be.instanceof(Function);
    });

    it('should export Action', () => {
        expect(D2Action).to.equal(Action);
    });

    it('should export Store', () => {
        expect(D2Store).to.equal(Store);
    });
});
