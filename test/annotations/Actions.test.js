'use strict';

import Dispatcher from '../../src/dispatcher/Dispatcher';
import Actions from '../../src/annotations/Actions';

describe('Annotation @Actions', () => {
    let userActions;
    let saveUserPromiseResolve;
    let saveUserPromiseReject;

    beforeEach(() => {
        spy(Dispatcher, 'dispatch');

        @Actions
         class UserActions {
            addUser(value) {
                return value;
            }
            deleteUser() {}
            saveUser() {
                return new Promise((resolve, reject) => {
                    saveUserPromiseResolve = resolve;
                    saveUserPromiseReject = reject;
                });
            }
        }

        userActions = new UserActions();
    });

    it('should be a function', () => {
        expect(Actions).to.be.instanceof(Function);
    });

    it('should create a symbol key for each of the methods', () => {
        expect(userActions.ADD_USER).to.not.be.undefined;
    });

    it('should call the dispatcher when the action is called', (done) => {
        userActions.addUser('Mark');

        setTimeout(() => {
            expect(Dispatcher.dispatch).to.be.called;
            done();
        });
    });

    it('should call the dispather with the correct data object', (done) => {
        userActions.addUser('Mark');

        setTimeout(() => {
            expect(Dispatcher.dispatch).to.be.calledWith({
                type: userActions.ADD_USER,
                data: 'Mark'
            });
            done();
        });
    });

    it('should only call the dispatcher when the action promise resolved', (done) => {
        userActions.saveUser();

        setTimeout(() => {
            expect(Dispatcher.dispatch).not.to.be.called;

            saveUserPromiseResolve('Mark');
            setTimeout(() => {
                expect(Dispatcher.dispatch).to.be.called;
                done();
            });
        });
    });

    it('should not call the dispatcher when the action promise rejected', (done) => {
        userActions.saveUser();

        setTimeout(() => {
            expect(Dispatcher.dispatch).not.to.be.called;

            saveUserPromiseReject('Mark');
            setTimeout(() => {
                expect(Dispatcher.dispatch).not.to.be.called;
                done();
            });
        });
    });
});
