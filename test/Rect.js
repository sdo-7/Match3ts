import Rect from '../build/Rect.js';

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
    const obj = new Rect();

    isnan(obj.x);
    isnan(obj.y);
    isnan(obj.width);
    isnan(obj.height);
  },

  'constructor': function () {
    const obj = new Rect(1, 2, 3, 4);

    se(obj.x, 1);
    se(obj.y, 2);
    se(obj.width, 3);
    se(obj.height, 4);
  },

  'reset': function () {
    const obj = new Rect(1, 2, 3, 4);

    obj.reset();
    isnan(obj.x);
    isnan(obj.y);
    isnan(obj.width);
    isnan(obj.height);
  },

  'fromSize': function () {
    const obj = new Rect();

    obj.fromSize({width: 2, height: 3});
    se(obj.width, 2);
    se(obj.height, 3);
  },
};
