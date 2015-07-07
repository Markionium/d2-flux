'use strict';
/* globals require global */

let chai = require('chai');
let sinon = require('sinon');
let sinonChai = require('sinon-chai');
chai.use(sinonChai);

global.expect = chai.expect;

let sandbox;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
    global.spy = sandbox.spy.bind(sandbox);
    global.stub = sandbox.stub.bind(sandbox);
});

afterEach(() => {
   sandbox.restore();
});
