'use strict';

function camelToUnderscore(propertyName) {
	return propertyName.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

function createSymbolOnObjectForKey(key) {
	this[key] = Symbol(key);
}

function Actions(ClassConstructor) {
	return class Actions extends (ClassConstructor) { //eslint-disable-line no-shadow
		constructor() {
			super();

			let actionsInstance = Object.getPrototypeOf(Object.getPrototypeOf(this));

			Object.getOwnPropertyNames(actionsInstance)
				.filter(propertyName => propertyName !== 'constructor')
				.map(camelToUnderscore)
				.forEach(createSymbolOnObjectForKey, this);
		}
	};
}

export default Actions;
