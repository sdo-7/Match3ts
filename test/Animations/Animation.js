import Animation from '../../build/Animations/Animation.js';

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
    const obj = new Animation('qwe', 1, 2, 3, 4);

    se(obj._current, 'qwe');
    se(obj._thisArg, 1);
    se(obj._arg, 2);
    se(obj._onUpdate, 3);
    se(obj._onFinish, 4);
    isfalse(obj._done);
  },

  'done': function () {
    const obj = new Animation();

    isfalse(obj.done);

    obj.done = false;
    isfalse(obj.done);

    obj.done = true;
    istrue(obj.done);

    obj.done = false;
    istrue(obj.done);
  },

  'cancel': function () {
    const obj = new Animation();

    obj.cancel();
    istrue(obj.done);
  },

  'callOnUpdate': function () {
    const obj = new Animation();

    obj._callOnUpdate()

    obj._current = 'qwe';
    obj._thisArg = {};
    obj._arg = {};
    obj._onUpdate = sinon.spy();
    obj._callOnUpdate();
    sa.calledOnce(obj._onUpdate);
    sa.calledOn(obj._onUpdate, obj._thisArg);
    sa.calledWith(obj._onUpdate, 'qwe', obj._arg, obj);
  },

  'callOnFinish': function () {
    const obj = new Animation();

    obj._callOnFinish();

    obj._thisArg = {};
    obj._arg = {};
    obj._onFinish = sinon.spy();
    obj._callOnFinish();
    sa.calledOnce(obj._onFinish);
    sa.calledOn(obj._onFinish, obj._thisArg);
    sa.calledWith(obj._onFinish, obj._arg, obj);
  },
};
