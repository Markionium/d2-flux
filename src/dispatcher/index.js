'use strict';

import {Dispatcher} from 'flux';

class D2FluxDispatcher extends Dispatcher {
	register(...args) {
		return super.register(...args);
	}

	dispatch(...args) {
		let [{type}] = args;

		if (!type) {
			throw new Error('Dispatcher: Action type can not be undefined');
		}

		return super.dispatch(...args);
	}
}

export default new D2FluxDispatcher();
