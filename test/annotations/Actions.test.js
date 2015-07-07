'use strict';

import Actions from '../../src/annotations/Actions';

describe('Annotation @Actions', () => {
    let userActions;

    beforeEach(() => {
        @Actions
         class UserActions {
            addUser() {}
            deleteUser() {}
            saveUser() {}
        }

        userActions = new UserActions();
    });

    it('should be a function', () => {
        expect(Actions).to.be.instanceof(Function);
    });

    it('should create a symbol key for each of the methods', () => {
        expect(userActions.ADD_USER).to.not.be.undefined;
    });
});
