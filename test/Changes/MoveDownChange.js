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
const MoveDownChange = await esmock('../../build/Changes/MoveDownChange.js', {
  '../../build/Changes/MatchChange.js': {
    default: MatchChange,
  },
});

let modelImpl;
let obj;

export default {
  'constructor': function () {
    const obj = new MoveDownChange(100, 200);
    se(obj._modelImpl, 100);
    se(obj._matchedElements, 200);
  },

  'elements': function () {
    const set = new Set();
    set.add(50);
    set.add(51);
    const obj = new MoveDownChange(null, set);

    const data = [];
    for (const el of obj.elements)
      data.push(el);
    se(data.length, 2);
    se(data[0], 50);
    se(data[1], 51);
  },

  'with model': {
    before () {
      const field = {
        atPos: sinon.stub(),
      };
      const logic = {
        moveDown: sinon.stub(),
        getAllMatches: sinon.stub(),
      };
      modelImpl = {
        field,
        logic,
        fillEmpties: sinon.stub(),
      };
    },

    beforeEach () {
      obj = new MoveDownChange(modelImpl, new Set());
    },

    afterEach () {
      sinon.reset();
    },

    'contains. false': function () {
      modelImpl.field.atPos.callsFake(function (a) {
        return a;
      });
      obj._matchedElements.add(51);
      obj._matchedElements.add(50);

      isfalse(obj.contains(52));
      sa.calledOnce(modelImpl.field.atPos);
      sa.calledWith(modelImpl.field.atPos, 52);
    },

    'contains. true': function () {
      modelImpl.field.atPos.callsFake(function (a) {
        return a;
      });
      obj._matchedElements.add(51);
      obj._matchedElements.add(50);

      istrue(obj.contains(50));
      sa.calledOnce(modelImpl.field.atPos);
      sa.calledWith(modelImpl.field.atPos, 50);
    },

    'start': function () {
      // obj._createAnimation = sinon.stub().returns(50);

      // se(obj.start(), 50);
      // sa.calledOnce(modelImpl.logic.moveDown);
      // sa.calledOnce(modelImpl.fillEmpties);
      // sa.calledOnce(obj._createAnimation);
    },

    'finish. no matches': function () {
      obj._matchedElements.add(50);
      obj._matchedElements.add(51);
      modelImpl.logic.getAllMatches.callsFake(function * () {});

      se(obj.finish(), undefined);
      se(obj._matchedElements.size, 0);
      sa.calledOnce(modelImpl.logic.getAllMatches);
    },

    'finish. with matches': function () {
      obj._matchedElements.add(50);
      obj._matchedElements.add(51);
      modelImpl.logic.getAllMatches.callsFake(function * () {
        yield 71;
        yield 72;
        yield 73;
      });

      istrue(obj.finish() instanceof MatchChange);
      sa.calledOnce(modelImpl.logic.getAllMatches);
      sa.calledOnce(MatchChange);
      sa.calledWithNew(MatchChange);
      sa.calledWith(MatchChange, obj._modelImpl, obj._matchedElements);

      se(obj._matchedElements.size, 3);
      const data = [];
      for (const el of obj._matchedElements)
        data.push(el);
      se(data[0], 71);
      se(data[1], 72);
      se(data[2], 73);
    },
  },
}
