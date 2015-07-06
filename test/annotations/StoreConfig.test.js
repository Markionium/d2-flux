'use strict';

import Dispatcher from '../../src/dispatcher/index';
import StoreConfig from '../../src/annotations/StoreConfig';

describe('Annotations @StoreConfig', () => {
	let annotatedStore;
	let AuthStore;

	beforeEach(() => {
		Dispatcher.register = spy(Dispatcher, 'register');
		Dispatcher.waitFor = spy();

		AuthStore = {
			dispatcherToken: 1
		}

		@StoreConfig({storesToWaitFor: [AuthStore.dispatcherToken], actions: [['myAction', 'myAction']]})
		class Store {
			constructor() {
				this.myAction = spy();
			}
		}

		annotatedStore = new Store('Default value');
	});

	afterEach(() => {
		Dispatcher.register.restore();
	});

	it('should be a function', () => {
		expect(StoreConfig).to.be.instanceof(Function);
	});

	it('should call register on the Dispatcher', () => {
		expect(Dispatcher.register).to.be.called;
	});

	it('should throw an error when no config object is given', (done) => {
		function shouldThrow() {
			@StoreConfig()
			class MyStore {}
		};

		//TODO: Could be done nicer but expect(<func>).to.throw(<message>) seems to be bugged
		//expect(shouldThrow).to.throw(new Error('@StoreConfig: A StoreConfig object is required (@StoreConfig({/* Config here */}))'));
		try {
			shouldThrow()
		} catch (e) {
			expect(e.message).to.equal('@StoreConfig: A StoreConfig object is required (@StoreConfig({/* Config here */}))');
			done();
		}
	});

	it('should call waitFor with the given `storesToWaitFor` on dispatch', () => {
		Dispatcher.dispatch({type: 'fakeAction'});

		expect(Dispatcher.waitFor).to.be.calledWith([AuthStore.dispatcherToken]);
	});

	it('should call the myAction method when a myAction has been dispatched', () => {
		Dispatcher.dispatch({type: 'myAction'});

		expect(annotatedStore.myAction).to.be.called;
	});
});
