import Change from '../../build/Changes/Change.js';

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
  'contains': function () {
    const obj = new Change();

    isfalse(obj.contains(0));
  }
}
