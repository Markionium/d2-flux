'use strict';

import Action from '../../src/action/Action';
import Store from '../../src/store/Store';

describe('Integration ActionStore', () => {
    let crudActions;
    let store;

    beforeEach(() => {
        crudActions = Action.createActionsFromNames([
            'create', 'read', 'update', 'delete'
        ]);

        class CrudStore extends Store {
            create(action) {
                action.complete('created');
            }

            read() {}

            update() {}

            delete() {}
        }

        store = new CrudStore();
    });

    it('store should react to the create action', (done) => {
        crudActions.create
            .subscribe((action) => {
                store.setState(action.value);
            });

        store.subscribe(storeState => {
            expect(storeState).to.equal('newState');
            done();
        });

        crudActions.create.execute('newState');
    });

    it('store fullfil the action result', (done) => {
        crudActions.create
            .subscribe((action) => {
                store.create(action);
            });

        crudActions.create.execute('newState')
            .subscribe((createResult) => {
                expect(createResult).to.equal('created');
                done();
            });
    });

    it('should only notify the subscriber that triggered the action', (done) => {
        let createStub = spy(store, 'create');
        let callbackOld = spy();
        let callbackNew = spy();

        crudActions.create.subscribe(createStub);

        crudActions.create.execute('oldState').subscribe(callbackOld);
        crudActions.create.execute('newState').subscribe(callbackNew);

        setTimeout(() => {
            expect(createStub.callCount).to.equal(2);
            expect(callbackOld.callCount).to.equal(1);
            expect(callbackNew.callCount).to.equal(1);
            done();
        }, 50);
    });
});
