import Size from '../build/Size.js';

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

export default {
  'constructor. no args': function () {
    const obj = new Size();
    isnan(obj.width);
    isnan(obj.height);
  },

  'constructor': function () {
    const obj = new Size(1, 2);

    se(obj.width, 1);
    se(obj.height, 2);
  },

  'reset': function () {
    const obj = new Size(1, 2);

    obj.reset();
    isnan(obj.width);
    isnan(obj.height);
  },

  'setSize': function () {
    const obj = new Size();

    obj.setSize(10, 20);
    se(obj.width, 10);
    se(obj.height, 20);
  },
};
