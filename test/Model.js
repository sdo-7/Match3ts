import Position from '../build/Position.js';

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
const Impl = sinon.spy(class {
  field = {
    width: 'field width',
    height: 'field height',
  };
  changes = {
    current: 'current change',
  };
  matches = {
  };
});
const SwapChange = sinon.spy(class {});
const Model = await esmock('../build/Model.js', {
  '../build/Model/ModelImpl.js': {
    default: Impl,
  },
  '../build/Changes/SwapChange.js': {
    default: SwapChange,
  },
});

export default {
  afterEach () {
    sinon.reset();
  },

  'constructor': function () {
    const obj = new Model(5, 6, 7, 8);

    sa.calledOnce(Impl);
    sa.calledWithNew(Impl);
    sa.calledWith(Impl, 5, 6, 7, 8);
  },

  'width': function () {
    const obj = new Model();

    se(obj.width, 'field width');
  },

  'height': function () {
    const obj = new Model();

    se(obj.height, 'field height');
  },

  'changes': function () {
    const obj = new Model();

    se(obj.change, 'current change');
  },

  'view': function () {
    const obj = new Model();

    const v1 = {};
    const v2 = {};

    obj.view = v1;

    se(obj._impl.view, v1);
    se(v1.model, obj);

    obj.view = v2;

    se(obj._impl.view, v2);
    se(v2.model, obj);
    se(v1.model, null);

    v2.model = null;
    obj.view = v2;
    se(v2.model, null);
  },

  'Symbol.iterator': function () {
    const obj = new Model();

    obj._impl.field[Symbol.iterator] = sinon.stub().returns('abc');

    se(obj[Symbol.iterator](), 'abc');

    sa.calledOnce(obj._impl.field[Symbol.iterator]);
  },

  'init': function () {
    const obj = new Model();

    obj._impl.matches.isAnyMatchAtPos = sinon.stub().returns(false).onCall(1).returns(true);
    obj._impl.field = ['qwe', 'asd', 'zxc'];
    obj._impl.field.setAtPos = sinon.spy();
    let count = 31;
    obj._impl.getNextValue = sinon.stub().callsFake(() => count++);

    obj.init();

    sa.callCount(obj._impl.getNextValue, 4);

    sa.callCount(obj._impl.field.setAtPos, 4);
    sa.calledWith(obj._impl.field.setAtPos.getCall(0), 31, 'qwe');
    sa.calledWith(obj._impl.field.setAtPos.getCall(1), 32, 'asd');
    sa.calledWith(obj._impl.field.setAtPos.getCall(2), 33, 'asd');
    sa.calledWith(obj._impl.field.setAtPos.getCall(3), 34, 'zxc');

    sa.callCount(obj._impl.matches.isAnyMatchAtPos, 4);
    sa.calledWith(obj._impl.matches.isAnyMatchAtPos.getCall(0), 'qwe');
    sa.calledWith(obj._impl.matches.isAnyMatchAtPos.getCall(1), 'asd');
    sa.calledWith(obj._impl.matches.isAnyMatchAtPos.getCall(2), 'asd');
    sa.calledWith(obj._impl.matches.isAnyMatchAtPos.getCall(3), 'zxc');
  },

  'isValidPos': function () {
    const obj = new Model();

    obj._impl.field.isValidPos = sinon.stub().returns('bcd');

    const pos = new Position(1, 2);
    se(obj.isValidPos(pos), 'bcd');

    sa.calledOnce(obj._impl.field.isValidPos);
    sa.calledWith(obj._impl.field.isValidPos, pos);
  },

  'atPos. undefined': function () {
    const obj = new Model();

    obj.isValidPos = sinon.stub().returns(false);
    obj._impl.field.atPos = sinon.spy();

    const pos = new Position(10, 20);
    se(obj.atPos(pos), undefined);

    sa.calledOnce(obj.isValidPos);
    sa.calledWith(obj.isValidPos, pos);

    sa.notCalled(obj._impl.field.atPos);
  },

  'atPos': function () {
    const obj = new Model();

    obj.isValidPos = sinon.stub().returns(true);
    obj._impl.field.atPos = sinon.stub().returns('asd');

    const pos = new Position(10, 20);
    se(obj.atPos(pos), 'asd');

    sa.calledOnce(obj.isValidPos);
    sa.calledWith(obj.isValidPos, pos);

    sa.calledOnce(obj._impl.field.atPos);
    sa.calledWith(obj._impl.field.atPos, pos);
  },

  'swap': function () {
    const obj = new Model();

    const el1 = {};
    const el2 = {};
    obj._impl.field.atPos = sinon.stub();
    obj._impl.field.atPos.onCall(0).returns(el1);
    obj._impl.field.atPos.onCall(1).returns(el2);
    obj._impl.changes.current = null;

    const pos1 = {};
    const pos2 = {};
    obj.swap(pos1, pos2);

    sa.callCount(obj._impl.field.atPos, 2);
    sa.calledWith(obj._impl.field.atPos.getCall(0), pos1);
    sa.calledWith(obj._impl.field.atPos.getCall(1), pos2);

    sa.calledOnce(SwapChange);
    sa.calledWithNew(SwapChange);
    sa.calledWith(SwapChange, obj._impl, el1, el2);

    istrue(obj._impl.changes.current instanceof SwapChange);
  },
};
