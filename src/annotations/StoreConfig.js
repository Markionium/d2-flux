'use strict';

import Dispatcher from '../dispatcher/index';

function StoreConfig(storesConfig) {
	if (!storesConfig) {
		throw new Error('@StoreConfig: A StoreConfig object is required (@StoreConfig({/* Config here */}))');
	}

	let {storesToWaitFor = [], actions = []} = storesConfig;

	let actionsMap = new Map(actions);

	return function (ClassName) {
		function boundCallback(...args) {
			Dispatcher.waitFor(storesToWaitFor);

			let [{type}] = args;
			if (actionsMap.has(type) && this[actionsMap.get(type)]) {
				this[actionsMap.get(type)].apply(this, args);
			}
		}

		class StoreWithActions extends (ClassName) {
			constructor(...rest) {
				super(...rest);

				this.dispatcherToken = Dispatcher.register(boundCallback.bind(this));
			}
		};

		return StoreWithActions;
	};
}

export default StoreConfig;
