import Changes from '../../build/Model/Changes.js';

import assert from 'assert';
const se = assert.strictEqual;
function istrue (value) {
  se(value, true);
}
function isfalse (value) {
  se(value, false);
}
function isnan (value) {
  istrue(Number.isNaN(value));
}

import sinon from 'sinon';
const sa = sinon.assert;

export default {
  'constructor': function () {
    const obj = new Changes();

    se(obj._current, null);
  },

  'empty': function () {
    const obj = new Changes();

    istrue(obj.empty);

    obj._current = 1;
    isfalse(obj.empty);
  },

  'get current': function () {
    const obj = new Changes();

    obj._current = 'abc';
    se(obj.current, 'abc');
  },

  'set current': function () {
    const obj = new Changes();

    obj.current = 'bcd';
    se(obj._current, 'bcd');

    obj.current = undefined;
    se(obj._current, null);
  },

  'startNext': function () {
    const obj = new Changes();

    const stub = {
      createNextChange: sinon.stub().returns('qwe'),
    };
    obj._current = stub;

    obj.startNext();
    se(obj._current, 'qwe');
    sa.calledOnce(stub.createNextChange);
  },
};
