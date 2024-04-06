import Position from '../../build/Position.js';

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

import esmock from 'esmock';
const MatchChange = sinon.spy(class {});
const SwapChange = await esmock('../../build/Changes/SwapChange.js', {
  '../../build/Changes/MatchChange.js': {
    default: MatchChange,
  },
});

let modelImpl;
let obj;

export default {
  'constructor': function () {
    const obj = new SwapChange(100, 200, 300);
    se(obj._modelImpl, 100);
    se(obj._a, 200);
    se(obj._b, 300);
    isfalse(!!obj._matchedElements);
  },

  'a': function () {
    const obj = new SwapChange(100, 200, 300);
    se(obj.a, 200);
  },

  'b': function () {
    const obj = new SwapChange(100, 200, 300);
    se(obj.b, 300);
  },

  'contains': function () {
    const obj = new SwapChange();

    obj._a = new Position(100, 200);
    obj._b = new Position(300, 400);

    istrue(obj.contains(new Position(100, 200)));
    istrue(obj.contains(new Position(300, 400)));
    isfalse(obj.contains(new Position(100, 300)));
  },

  'with model': {
    before () {
      const field = {
        swap: sinon.spy(),
      };
      const logic = {
        getMatchesAtPoses: sinon.stub(),
      };
      modelImpl = {
        field,
        logic,
      };
    },

    beforeEach () {
      obj = new SwapChange(modelImpl, 100, 200);
    },

    afterEach () {
      sinon.reset();
    },

    'apply. no matches': function () {
      modelImpl.logic.getMatchesAtPoses.callsFake(function * () {});

      se(obj._matchedElements.size, 0);
      sa.callCount(modelImpl.field.swap, 2);
      sa.alwaysCalledWith(modelImpl.field.swap, 100, 200);
      sa.calledOnce(modelImpl.logic.getMatchesAtPoses);
      sa.calledWith(modelImpl.logic.getMatchesAtPoses, 100, 200);
    },

    'apply. with matches': function () {
      modelImpl.logic.getMatchesAtPoses.callsFake(function * () {
        yield 71;
        yield 72;
      });

      se(obj.apply(), undefined);
      se(obj._matchedElements.size, 2);
      istrue(obj._matchedElements.has(71));
      istrue(obj._matchedElements.has(72));
      sa.callCount(modelImpl.field.swap, 1);
      sa.calledWith(modelImpl.field.swap, 100, 200);
      sa.calledOnce(modelImpl.logic.getMatchesAtPoses);
      sa.calledWith(modelImpl.logic.getMatchesAtPoses, 100, 200);
    },

    'finish. no matches': function () {
      se(obj.finish(), undefined);
      sa.notCalled(MatchChange);
    },

    'finish. with matches': function () {
      obj._matchedElements.add(80);
      obj._matchedElements.add(81);

      istrue(obj.finish() instanceof MatchChange);
      sa.calledOnce(MatchChange);
      sa.calledWithNew(MatchChange);
      sa.calledWith(MatchChange, obj._modelImpl, obj._matchedElements);
    },
  },
}
