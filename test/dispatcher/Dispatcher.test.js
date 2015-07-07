import Dispatcher from '../../src/dispatcher/Dispatcher';

describe('Dispatcher', () => {
    it('should throw an error when the dispatched action type is undefined', (done) => {
        try {
            Dispatcher.dispatch({});
        } catch (e) {
            expect(e.message).to.equal('Dispatcher: Action type can not be undefined');
            done();
        }
    });
});
