let chai = require('chai');
let sinon = require('sinon');
let sinonChai = require('sinon-chai');
chai.use(sinonChai);

global.expect = chai.expect;

global.spy = sinon.spy;
global.stub = sinon.stub;
