import Position from '../../build/Position.js';
import * as Numbers from '../../build/Numbers.js';

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
const SwapChange = sinon.spy(class {});
const Matches = await esmock('../../build/Model/Matches.js', {
  '../../build/Changes/MatchChange.js': {
    default: MatchChange,
  },
  '../../build/Changes/SwapChange.js': {
    default: SwapChange,
  },
});

let modelImpl;
let obj;

export default {
  beforeEach () {
    const field = {
      width: 99,
      height: 111,
      swap: sinon.stub(),
      at: sinon.stub(),
      atPos: sinon.stub(),
    };
    const changes = {
      push: sinon.stub(),
    };
    modelImpl = {
      field,
      changes,
    };

    obj = new Matches(modelImpl, 3);
  },

  afterEach () {
    sinon.reset();
  },

  'isAnyMatchAt': {
    beforeEach () {
      obj = new Matches();
      obj._isHMatchAt = sinon.stub();
      obj._isVMatchAt = sinon.stub();
    },

    afterEach () {
      sinon.reset();
    },

    'false false': function () {
      obj._isHMatchAt.returns(false);
      obj._isVMatchAt.returns(false);

      isfalse(obj.isAnyMatchAt(1, 2));
      sa.calledOnce(obj._isHMatchAt);
      sa.calledWith(obj._isHMatchAt, 1, 2);
      sa.calledOnce(obj._isVMatchAt);
      sa.calledWith(obj._isVMatchAt, 1, 2);
    },

    'false true': function () {
      obj._isHMatchAt.returns(false);
      obj._isVMatchAt.returns(true);

      istrue(obj.isAnyMatchAt(1, 2));
      sa.calledOnce(obj._isHMatchAt);
      sa.calledWith(obj._isHMatchAt, 1, 2);
      sa.calledOnce(obj._isVMatchAt);
      sa.calledWith(obj._isVMatchAt, 1, 2);
    },

    'true false': function () {
      obj._isHMatchAt.returns(true);
      obj._isVMatchAt.returns(false);

      istrue(obj.isAnyMatchAt(1, 2));
      sa.calledOnce(obj._isHMatchAt);
      sa.calledWith(obj._isHMatchAt, 1, 2);
      sa.notCalled(obj._isVMatchAt);
    },
  },

  'isAnyMatchAtPos': function () {
    obj.isAnyMatchAt = sinon.stub().returns('asd');

    se(obj.isAnyMatchAtPos(new Position(1, 2)), 'asd');
    sa.calledOnce(obj.isAnyMatchAt);
    sa.calledWith(obj.isAnyMatchAt, 1, 2);
  },

  'getMatchesAtPoses': function () {
    obj._getMatchesAt = sinon.stub().callsFake(function *(x, y) {
      yield new Position(x,   y);
      yield new Position(x+1, y+5);
    });

    const poses = [
      new Position(10, 20),
      new Position(30, 40),
    ];
    const data = [...obj.getMatchesAtPoses(...poses)];
    se(data.length, 4);
    se(data[0].x, 10);
    se(data[0].y, 20);
    se(data[1].x, 11);
    se(data[1].y, 25);
    se(data[2].x, 30);
    se(data[2].y, 40);
    se(data[3].x, 31);
    se(data[3].y, 45);
    sa.callCount(obj._getMatchesAt, 2);
  },

  'getAllMatches': function () {
    obj._getAllHMatches = sinon.stub().callsFake(function *() {
      yield 1;
      yield 2;
    });
    obj._getAllVMatches = sinon.stub().callsFake(function *() {
      yield 3;
      yield 4;
    });

    const data = [...obj.getAllMatches()];
    se(data.length, 4);
    se(data[0], 1);
    se(data[1], 2);
    se(data[2], 3);
    se(data[3], 4);
    sa.calledOnce(obj._getAllHMatches);
    sa.calledOnce(obj._getAllVMatches);
  },

  '_getMatchStart': function () {
    modelImpl.field.atPos.returns({value: 5});
    modelImpl.field.atPos.onCall(2).returns({value: null});

    const a = obj._getMatchStart(10, 20, 'x', 5);
    se(a.x, 8);
    se(a.y, 20);
    sa.callCount(modelImpl.field.atPos, 3);
    sinon.reset();

    modelImpl.field.atPos.returns({value: 5});
    modelImpl.field.atPos.onCall(3).returns({value: null});

    const b = obj._getMatchStart(10, 20, 'y', 5);
    se(b.x, 10);
    se(b.y, 17);
    sa.callCount(modelImpl.field.atPos, 4);
  },

  '_getMatchEnd': function () {
    modelImpl.field.atPos.returns({value: 5});
    modelImpl.field.atPos.onCall(2).returns({value: null});

    const a = obj._getMatchEnd(10, 20, 'x', 5, 30);
    se(a.x, 12);
    se(a.y, 20);
    sa.callCount(modelImpl.field.atPos, 3);
    sinon.reset();

    modelImpl.field.atPos.returns({value: 5});
    modelImpl.field.atPos.onCall(3).returns({value: null});

    const b = obj._getMatchEnd(10, 20, 'y', 5, 30);
    se(b.x, 10);
    se(b.y, 23);
    sa.callCount(modelImpl.field.atPos, 4);
  },

  '_getMatchAt. null': function () {
    modelImpl.field.at.returns({value: null});
    obj._getMatchStart = sinon.spy();

    se([...obj._getMatchAt(5, 7, 'y', 10)].length, 0);
    sa.calledOnce(modelImpl.field.at);
    sa.calledWith(modelImpl.field.at, 5, 7);
    sa.notCalled(obj._getMatchStart);
  },

  '_getMatchAt. too short': function () {
    modelImpl.field.at.returns({value: 15});
    obj._getMatchStart = sinon.stub().returns(new Position(5, 6));
    obj._getMatchEnd = sinon.stub().returns(new Position(5, 7));
    modelImpl.field.atPoses = sinon.spy();

    se([...obj._getMatchAt(5, 7, 'y', 10)].length, 0);
    sa.calledOnce(modelImpl.field.at);
    sa.calledWith(modelImpl.field.at, 5, 7);
    sa.calledOnce(obj._getMatchStart);
    sa.calledWith(obj._getMatchStart, 5, 7, 'y', 15);
    sa.calledOnce(obj._getMatchEnd);
    sa.calledWith(obj._getMatchEnd, 5, 7, 'y', 15, 10);
    sa.notCalled(modelImpl.field.atPos);
  },

  '_getMatchAt': function () {
    modelImpl.field.at.returns({value: 15});
    obj._getMatchStart = sinon.stub().returns(new Position(5, 6));
    obj._getMatchEnd = sinon.stub().returns(new Position(5, 9));
    modelImpl.field.atPoses = sinon.stub().callsFake(function *(...poses) {
      for (const pos of poses)
        yield pos;
    });

    const data = [...obj._getMatchAt(5, 7, 'y', 10)];
    se(data.length, 4);
    se(data[0].x, 5);
    se(data[0].y, 6);
    se(data[1].x, 5);
    se(data[1].y, 7);
    se(data[2].x, 5);
    se(data[2].y, 8);
    se(data[3].x, 5);
    se(data[3].y, 9);
    sa.calledOnce(modelImpl.field.at);
    sa.calledWith(modelImpl.field.at, 5, 7);
    sa.calledOnce(obj._getMatchStart);
    sa.calledWith(obj._getMatchStart, 5, 7, 'y', 15);
    sa.calledOnce(obj._getMatchEnd);
    sa.calledWith(obj._getMatchEnd, 5, 7, 'y', 15, 10);
    sa.callCount(modelImpl.field.atPoses, 1);
  },

  '_getMatchAtPos': function () {
    obj._getMatchAt = sinon.stub().returns('asd');

    se(obj._getMatchAtPos(new Position(10, 20), 'x', 99), 'asd');
    sa.calledOnce(obj._getMatchAt);
    sa.calledWith(obj._getMatchAt, 10, 20, 'x', 99);
  },

  '_isMatchAt. false': function () {
    obj._getMatchAt = sinon.stub().callsFake(function *() {
      return;
    });
    isfalse(obj._isMatchAt(5, 6, 'x', 20));
    sa.calledOnce(obj._getMatchAt);
    sa.calledWith(obj._getMatchAt, 5, 6, 'x', 20);
  },

  '_isMatchAt. true': function () {
    obj._getMatchAt = sinon.stub().callsFake(function *() {
      yield 1;
    });
    istrue(obj._isMatchAt(5, 6, 'x', 20));
    sa.calledOnce(obj._getMatchAt);
    sa.calledWith(obj._getMatchAt, 5, 6, 'x', 20);
  },

  '_isHMatchAt. false': function () {
    obj._isMatchAt = sinon.stub().returns(false);
    isfalse(obj._isHMatchAt(5, 6));
    sa.calledOnce(obj._isMatchAt);
    sa.calledWith(obj._isMatchAt, 5, 6, 'x', 99);
  },

  '_isHMatchAt. true': function () {
    obj._isMatchAt = sinon.stub().returns(true);
    istrue(obj._isHMatchAt(5, 6));
    sa.calledOnce(obj._isMatchAt);
    sa.calledWith(obj._isMatchAt, 5, 6, 'x', 99);
  },

  '_isVMatchAt. false': function () {
    obj._isMatchAt = sinon.stub().returns(false);
    isfalse(obj._isVMatchAt(5, 6));
    sa.calledOnce(obj._isMatchAt);
    sa.calledWith(obj._isMatchAt, 5, 6, 'y', 111);
  },

  '_isVMatchAt. true': function () {
    obj._isMatchAt = sinon.stub().returns(true);
    istrue(obj._isVMatchAt(5, 6));
    sa.calledOnce(obj._isMatchAt);
    sa.calledWith(obj._isMatchAt, 5, 6, 'y', 111);
  },

  '_getHMatchAt': function () {
    obj._getMatchAt = sinon.stub().returns('abc');

    se(obj._getHMatchAt(5, 6), 'abc');
    sa.calledOnce(obj._getMatchAt);
    sa.calledWith(obj._getMatchAt, 5, 6, 'x', 99);
  },

  '_getVMatchAt': function () {
    obj._getMatchAt = sinon.stub().returns('zxc');

    se(obj._getVMatchAt(4, 5), 'zxc');
    sa.calledOnce(obj._getMatchAt);
    sa.calledWith(obj._getMatchAt, 4, 5, 'y', 111);
  },

  '_getMatchesAt': function () {
    obj._getHMatchAt = sinon.stub().callsFake(function *() {
      yield 1;
      yield 2;
    });
    obj._getVMatchAt = sinon.stub().callsFake(function *() {
      yield 3;
      yield 4;
    });

    const data = [...obj._getMatchesAt(7, 8)];
    se(data.length, 4);
    se(data[0], 1);
    se(data[1], 2);
    se(data[2], 3);
    se(data[3], 4);
    sa.calledOnce(obj._getHMatchAt);
    sa.calledWith(obj._getHMatchAt, 7, 8);
    sa.calledOnce(obj._getVMatchAt);
    sa.calledWith(obj._getVMatchAt, 7, 8);
  },

  '_getAllMatchesForLine. no matches': function () {
    obj._getMatchAt = sinon.stub().callsFake(function *() {
    });

    const data = [...obj._getAllMatchesForLine(new Position(NaN, 1), 'x', 5)];
    se(data.length, 0);
    sa.callCount(obj._getMatchAt, 3);
    sa.calledWith(obj._getMatchAt.getCall(0), 0, 1, 'x', 5);
    sa.calledWith(obj._getMatchAt.getCall(1), 1, 1, 'x', 5);
    sa.calledWith(obj._getMatchAt.getCall(2), 2, 1, 'x', 5);
  },

  '_getAllMatchesForLine. 1 match': function () {
    obj._getMatchAt = sinon.stub().callsFake(function *(x, y) {
      if (x < 2)
        return;
      yield x+10;
      yield x+20;
      yield x+30;
    });

    const data = [...obj._getAllMatchesForLine(new Position(NaN, 1), 'x', 6)];
    se(data.length, 3);
    se(data[0], 12);
    se(data[1], 22);
    se(data[2], 32);
    sa.callCount(obj._getMatchAt, 3);
    sa.calledWith(obj._getMatchAt.getCall(0), 0, 1, 'x', 6);
    sa.calledWith(obj._getMatchAt.getCall(1), 1, 1, 'x', 6);
    sa.calledWith(obj._getMatchAt.getCall(2), 2, 1, 'x', 6);
  },

  '_getAllMatchesForLine. 2 matches': function () {
    obj._getMatchAt = sinon.stub().callsFake(function *(x, y) {
      switch (x) {
      case 2:
      case 6:
        yield x+0;
        yield x+1;
        yield x+2;
      }
    });

    const data = [...obj._getAllMatchesForLine(new Position(NaN, 1), 'x', 9)];
    se(data.length, 6);
    se(data[0], 2);
    se(data[1], 3);
    se(data[2], 4);
    se(data[3], 6);
    se(data[4], 7);
    se(data[5], 8);
    sa.callCount(obj._getMatchAt, 5);
    sa.calledWith(obj._getMatchAt.getCall(0), 0, 1, 'x', 9);
    sa.calledWith(obj._getMatchAt.getCall(1), 1, 1, 'x', 9);
    sa.calledWith(obj._getMatchAt.getCall(2), 2, 1, 'x', 9);
    sa.calledWith(obj._getMatchAt.getCall(3), 5, 1, 'x', 9);
    sa.calledWith(obj._getMatchAt.getCall(4), 6, 1, 'x', 9);
  },

  '_getAllMatchesForLine. too short': function () {
    obj._getMatchAt = sinon.stub().callsFake(function *(x, y) {
      switch (x) {
      case 2:
      case 6:
        yield x+0;
        yield x+1;
        yield x+2;
      }
    });

    const data = [...obj._getAllMatchesForLine(new Position(NaN, 1), 'x', 8)];
    se(data.length, 3);
    se(data[0], 2);
    se(data[1], 3);
    se(data[2], 4);
    sa.callCount(obj._getMatchAt, 4);
    sa.calledWith(obj._getMatchAt.getCall(0), 0, 1, 'x', 8);
    sa.calledWith(obj._getMatchAt.getCall(1), 1, 1, 'x', 8);
    sa.calledWith(obj._getMatchAt.getCall(2), 2, 1, 'x', 8);
    sa.calledWith(obj._getMatchAt.getCall(3), 5, 1, 'x', 8);
  },

  '_getAllHMatches': function () {
    const stub = sinon.stub().callsFake(function *() {
      yield 1;
      yield 2;
    });

    obj._getAllMatchesForLine = sinon.stub().callsFake(function (pos, vn, limit) {
      const x = Numbers.isnan(pos.x) ? -1 : pos.x;
      const y = Numbers.isnan(pos.y) ? -1 : pos.y;
      return stub(x, y, vn, limit);
    });
    modelImpl.field.height = 5;

    const data = [...obj._getAllHMatches()];
    se(data.length, 10);
    se(data[0], 1);
    se(data[1], 2);
    se(data[2], 1);
    se(data[3], 2);
    se(data[4], 1);
    se(data[5], 2);
    se(data[6], 1);
    se(data[7], 2);
    se(data[8], 1);
    se(data[9], 2);
    sa.callCount(stub, 5);
    sa.calledWith(stub.getCall(0), -1, 0, 'x', 99);
    sa.calledWith(stub.getCall(1), -1, 1, 'x', 99);
    sa.calledWith(stub.getCall(2), -1, 2, 'x', 99);
    sa.calledWith(stub.getCall(3), -1, 3, 'x', 99);
    sa.calledWith(stub.getCall(4), -1, 4, 'x', 99);
  },

  '_getAllVMatches': function () {
    const stub = sinon.stub().callsFake(function *() {
      yield 1;
      yield 2;
    });

    obj._getAllMatchesForLine = sinon.stub().callsFake(function (pos, vn, limit) {
      const x = Numbers.isnan(pos.x) ? -1 : pos.x;
      const y = Numbers.isnan(pos.y) ? -1 : pos.y;
      return stub(x, y, vn, limit);
    });
    modelImpl.field.width = 5;

    const data = [...obj._getAllVMatches()];
    se(data.length, 10);
    se(data[0], 1);
    se(data[1], 2);
    se(data[2], 1);
    se(data[3], 2);
    se(data[4], 1);
    se(data[5], 2);
    se(data[6], 1);
    se(data[7], 2);
    se(data[8], 1);
    se(data[9], 2);
    sa.callCount(stub, 5);
    sa.calledWith(stub.getCall(0), 0, -1, 'y', 111);
    sa.calledWith(stub.getCall(1), 1, -1, 'y', 111);
    sa.calledWith(stub.getCall(2), 2, -1, 'y', 111);
    sa.calledWith(stub.getCall(3), 3, -1, 'y', 111);
    sa.calledWith(stub.getCall(4), 4, -1, 'y', 111);
  },
}
