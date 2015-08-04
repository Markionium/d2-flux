'use strict';

import Store from '../../src/store/Store';

import {Observable} from 'rx';

describe('Store', () => {
    let store;

    beforeEach(() => {
        store = new Store();
    });

    it('should be a function', () => {
       expect(Store).to.be.instanceof(Function);
    });

    describe('state', () => {
        it('should have a state property that is undefined on default', () => {
            expect(store.state).to.be.undefined;
        });

        it('should be initialized after a value was passed to constructor', (done) => {
            store = new Store({name: 'Mark'});

            setTimeout(() => {
                expect(store.state).to.deep.equal({name: 'Mark'});
                done();
            });
        });
    });

    describe('with Promise as initial value', () => {
        it('should resolve the promise and set it as the value', (done) => {
            store = new Store(Promise.resolve({name: 'Mark'}));

            setTimeout(() => {
                expect(store.state).to.deep.equal({name: 'Mark'});
                done();
            });
        });

        it('should reject the value not set the state', (done) => {
            store = new Store(Promise.reject(new Error('Could not load value')));

            setTimeout(() => {
                expect(store.state).to.deep.equal(undefined);
                done();
            });
        });
    });

    describe('emitState', () => {
        it('should have emitted the intial state when the store was initialized with a state', (done) => {
            let onNextSpy = spy();
            store = new Store({name: 'Mark'});
            store.subscribe(onNextSpy);

            setTimeout(() => {
                expect(store.state).to.deep.equal({name: 'Mark'});
                done();
            });
        });

        it('should emit the newly set state', () => {
            let onNextSpy = spy();
            store = new Store();

            store.setState({name: 'Mark'});
            store.subscribe(onNextSpy);

            expect(onNextSpy).to.be.calledWith({name: 'Mark'});
        });

        it('should emit an error when the initial promise fails', (done) => {
            let onErrorSpy = spy();
            store = new Store(Promise.reject(new Error('Could not load value')));
            store.subscribe(undefined, onErrorSpy);

            setTimeout(() => {
                expect(onErrorSpy).to.be.called;
                done();
            });
        });

        it('should not emit an undefined value if no inital value has been given', (done) => {
            let onNextSpy = spy();
            store = new Store();

            store.subscribe(onNextSpy);


            setTimeout(() => {
                expect(onNextSpy).not.to.be.called;
                done();
            });
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

    describe('inheritance', () => {
        it('should be able to create a functional subclass', (done) => {
            class UserStore extends Store {}

            let userStore = new UserStore({name: 'Mark', userName: 'markpo'});

            setTimeout(() => {
                expect(userStore).to.be.instanceof(Store);
                expect(userStore.state).to.deep.equal({name: 'Mark', userName: 'markpo'});
                done();
            });
        });
    });

    describe('observable methods', () => {
        it('should work as expected', (done) => {
            new Store({name: 'Mark'})
                .throttle(1)
                .subscribe((value) => {
                    expect(value).to.deep.equal({name: 'Mark'});
                    done();
                });
        });

        it('should throttle the output', (done) => {
            let valueFromObservable;

            new Store({name: 'Mark'})
                .throttle(2)
                .subscribe((value) => {
                    valueFromObservable = value;
                });

            setTimeout(() => {
                expect(valueFromObservable).to.be.undefined;
            }, 0);

            setTimeout(() => {
                expect(valueFromObservable).not.to.be.undefined;
                done();
            }, 4);
        });

        it('should still receive replayed values', (done) => {
            store = new Store({name: 'Mark'});

            store.setState({name: 'Hao'});

            store.subscribe((value) => {
                expect(value).to.deep.equal({name: 'Hao'});
                done();
            });
        });

        it('should not call completed', (done) => {
            let completedSpy = spy();
            store = new Store({name: 'Mark'});

            store.setState({name: 'Hao'});

            store.subscribe(() => {}, () => {}, completedSpy);

            setTimeout(() => {
                expect(completedSpy).not.to.be.called;
                done();
            });
        });
    });

    describe('setSource()', () => {
        it('should be a method', () => {
            expect(store.setSource).to.be.instanceof(Function);
        });

        it('should call setState with the result of the passed Observable', () => {
            spy(store, 'setState');

            store.setSource(Observable.return({name: 'John'}));

            expect(store.setState).to.be.called;
        });

        it('should emit an error when the source emits an error', (done) => {
            spy(store, 'setState');

            store.setSource(Observable.throw('Failed to load'));

            expect(store.setState).not.to.be.called;

            store.subscribe(() => {}, (error) => {
                expect(error).to.equal('Rethrown error from source: Failed to load');
                done();
            });
        });
    });

    describe('create()', () => {
        it('should create a store object', () => {
            expect(Store.create()).to.be.instanceof(Store);
        });

        it('should have initialzed the Store with the value of geInitialState', () => {
            store = Store.create({
                getInitialState() {
                    return {name: 'Mark'};
                }
            });

            store.subscribe(value => {
                expect(value).to.deep.equal({name: 'Mark'});
            });
        });

        it('should add the passed methods onto the created object', () => {
            store = Store.create({
                getInitialState() {
                    return {name: 'Mark'};
                },

                getMyCustomValue() {

                }
            });

            expect(store.getMyCustomValue).to.be.instanceof(Function);
        });

        it('should not add getInitialState to the result object', () => {
            store = Store.create({
                getInitialState() {
                    return {name: 'Mark'};
                },

                getMyCustomValue() {

                }
            });

            expect(store.getInitialState).to.be.undefined;
        });

        it('should copy properties from the object onto the created object', () => {
            store = Store.create({
                name: 'MyStore',
                getMyCustomValue() {

                }
            });

            expect(store.name).to.equal('MyStore');
        });
    });
});
