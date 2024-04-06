import LinearAnimation from '../../build/Animations/LinearAnimation.js';

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

let obj;

export default {
  'constructor': function () {
    const opts = {
      speed: 1,
      start: 2,
      end: 3,
      thisArg: 4,
      arg: 5,
      onUpdate: 6,
      onFinish: 7
    };
    const obj = new LinearAnimation(opts);

    se(obj._speed, 1);
    se(obj._current, 2);
    se(obj._end, 3);
    se(obj._thisArg, 4);
    se(obj._arg, 5);
    se(obj._onUpdate, 6);
    se(obj._onFinish, 7);
  },

  'calcCurrent': {
    before () {
      const opts = {
        speed: 100,
      };

      obj = new LinearAnimation(opts);
    },

    'smaller to exact': function () {
      obj._current = 0;
      obj._end = 1000;

      obj._calcCurrent(5_000);
      se(obj._current, 500);

      obj._calcCurrent(5_000);
      se(obj._current, 1000);

      obj._calcCurrent(5_000);
      se(obj._current, 1000);
    },

    'negative smaller to exact': function () {
      obj._current = 0;
      obj._end = -1000;

      obj._calcCurrent(5_000);
      se(obj._current, -500);

      obj._calcCurrent(5_000);
      se(obj._current, -1000);

      obj._calcCurrent(5_000);
      se(obj._current, -1000);
    },

    'smaller to bigger': function () {
      obj._current = 0;
      obj._end = 1000;

      obj._calcCurrent(5_000);
      se(obj._current, 500);

      obj._calcCurrent(7_000);
      se(obj._current, 1000);

      obj._calcCurrent(5_000);
      se(obj._current, 1000);
    },

    'negative smaller to bigger': function () {
      obj._current = 0;
      obj._end = -1000;

      obj._calcCurrent(5_000);
      se(obj._current, -500);

      obj._calcCurrent(7_000);
      se(obj._current, -1000);

      obj._calcCurrent(5_000);
      se(obj._current, -1000);
    },

    'exact': function () {
      obj._current = 0;
      obj._end = 100;

      obj._calcCurrent(1_000);
      se(obj._current, 100);

      obj._calcCurrent(1_000);
      se(obj._current, 100);
    },

    'negative exact': function () {
      obj._current = 0;
      obj._end = -100;

      obj._calcCurrent(1_000);
      se(obj._current, -100);

      obj._calcCurrent(1_000);
      se(obj._current, -100);
    },

    'bigger': function () {
      obj._current = 0;
      obj._end = 100;

      obj._calcCurrent(2_000);
      se(obj._current, 100);

      obj._calcCurrent(2_000);
      se(obj._current, 100);
    },

    'negative bigger': function () {
      obj._current = 0;
      obj._end = -100;

      obj._calcCurrent(2_000);
      se(obj._current, -100);

      obj._calcCurrent(2_000);
      se(obj._current, -100);
    },

    '+Infinity': function () {
      obj._current = -100;
      obj._end = Infinity;

      obj._calcCurrent(1_000);
      se(obj._current, 0);

      obj._calcCurrent(1_000);
      se(obj._current, 100);
    },

    '-Infinity': function () {
      obj._current = 100;
      obj._end = -Infinity;

      obj._calcCurrent(1_000);
      se(obj._current, 0);

      obj._calcCurrent(1_000);
      se(obj._current, -100);
    },
  },

  'methods': {
    beforeEach () {
      const opts = {
        speed: 100,
        start: 0,
        end: 100,
        onUpdate: sinon.spy(),
        onFinish: sinon.spy(),
      };

      obj = new LinearAnimation(opts);
    },

    afterEach () {
      sinon.reset();
    },

    'update': function () {
      obj.update(2000);

      istrue(obj._done);
      sa.calledOnce(obj._onUpdate);
      sa.notCalled(obj._onFinish);
    },

    'finish': function () {
      obj.finish();

      isfalse(obj._done);
      sa.notCalled(obj._onUpdate);
      sa.calledOnce(obj._onFinish);
    },
  },
};
