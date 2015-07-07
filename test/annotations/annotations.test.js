'use strict';

const annotations = require('../../src/annotations');

describe('Annotations module', () => {
    it('should export an object with annotations', () => {
        expect(annotations.Actions).to.not.be.undefined;
        expect(annotations.StoreConfig).to.not.be.undefined;
    });
});
