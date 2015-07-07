'use strict';

let sinon = require('sinon');

var sandbox;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
    global.spy = sandbox.spy.bind(sandbox);
    global.stub = sandbox.stub.bind(sandbox);
});

afterEach(() => {
    sandbox.restore();
});
