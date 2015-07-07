'use strict';

import {log} from '../src/index';

describe('D2-Flux', () => {
    it('should have a log property', () => {
        expect(log).to.not.be.undefined;
    });

    it('should have the setLevel method', () => {
        expect(log.setLevel).to.be.instanceof(Function);
    });
});
