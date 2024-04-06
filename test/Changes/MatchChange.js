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
const MoveDownChange = sinon.spy(class {});
const MatchChange = await esmock('../../build/Changes/MatchChange.js', {
  '../../build/Changes/MoveDownChange.js': {
    default: MoveDownChange,
  },
});

let modelImpl;
let obj;

export default {
  'constructor': function () {
    const obj = new MatchChange(100, 200);
    se(obj._modelImpl, 100);
    se(obj._matchedElements, 200);
  },

  'elements': function () {
    const obj = new MatchChange();
    obj._matchedElements = new Set();
    obj._matchedElements.add(100);
    obj._matchedElements.add(200);

    const data = [];
    for (const el of obj.elements)
      data.push(el);

    se(data.length, 2);
    se(data[0], 100);
    se(data[1], 200);
  },

  'with model': {
    before () {
      const field = {
        atPos: sinon.stub(),
        setAtPoses: sinon.stub(),
      };
      modelImpl = {
        field,
      };
    },

    beforeEach () {
      obj = new MatchChange(modelImpl, new Set());
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
      obj._createAnimation = sinon.stub().returns(70);

      se(obj.start(), 70);
      sa.calledOnce(obj._createAnimation);
    },

    'finish': function () {
      // istrue(obj.finish() instanceof MoveDownChange);
      // sa.calledOnce(modelImpl.field.setAtPoses);
      // sa.calledWith(modelImpl.field.setAtPoses, obj._matchedElements, null);
      // sa.calledOnce(MoveDownChange);
      // sa.calledWithNew(MoveDownChange);
      // sa.calledWith(MoveDownChange, obj._modelImpl, obj._matchedElements);
    }
  },
}
