'use strict';

import Store from '../../src/store/Store';

import {ReplaySubject} from 'rx';

describe('Store', () => {
    let store;

    beforeEach(() => {
        store = new Store();
    });

    it('should be a function', () => {
       expect(Store).to.be.instanceof(Function);
    });

    it('should be an instance of ReplaySubject', () => {
        expect(store).to.be.instanceof(ReplaySubject);
    });

    describe('state', () => {
        it('should have a state property that is undefined on default', () => {
            expect(store.state).to.be.undefined;
        });

        it('should be initialized after a value was passed to constructor', () => {
            store = new Store({name: 'Mark'});

            expect(store.state).to.deep.equal({name: 'Mark'});
        });
    });

    describe('emitState', () => {
        let onNextSpy;

        beforeEach(() => {
            onNextSpy = spy();

            store.subscribe(onNextSpy);
        });

        it('should be a method', () => {
            expect(store.emitState).to.be.instanceof(Function);
        });

        it('should notify subscribers', () => {
            store.emitState();

            expect(onNextSpy.callCount).to.equal(1);
        });

        it('should have emitted the intial state when the store was initialized with a state', () => {
            store = new Store({name: 'Mark'});
            store.subscribe(onNextSpy);

            expect(onNextSpy).to.be.calledWith({name: 'Mark'});
        });
    });

    describe('setState', () => {
        it('should be a method', () => {
            expect(store.setState).to.be.instanceof(Function);
        });

        it('should set the state', () => {
            store.setState({name: 'Mark'});

            expect(store.state).to.deep.equal({name: 'Mark'});
        });

        it('should emit the newly set state', () => {
            let onNextSpy = spy();
            store = new Store();

            store.setState({name: 'Mark'});
            store.subscribe(onNextSpy);

            expect(onNextSpy).to.be.calledWith({name: 'Mark'});
        });
    });

    describe('getState', () => {
        it('should be a method', () => {
            expect(store.getState).to.be.instanceof(Function);
        });

        it('should return the set state', () => {
            store.setState({name: 'Mark'});

            expect(store.getState()).to.deep.equal({name: 'Mark'});
        });
    });
});
