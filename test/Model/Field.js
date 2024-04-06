import Position, {posEqual} from '../../build/Position.js';
import Vector from '../../build/Vector.js';

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
const isValidPos = sinon.stub();
const Field = await esmock('../../build/Model/Field.js', {
  '../../build/Position.js': {
    default: Position,
    isValidPos,
  },
});

let obj;

export default {
  'constructor. throws': function () {
    assert.throws(() => new Field(  0, 10), { name: 'RangeError' });
    assert.throws(() => new Field( -1, 10), { name: 'RangeError' });
    assert.throws(() => new Field( 10,  0), { name: 'RangeError' });
    assert.throws(() => new Field( 10, -1), { name: 'RangeError' });
    assert.throws(() => new Field('a', 10), { name: 'TypeError'  });
    assert.throws(() => new Field( 10,'a'), { name: 'TypeError'  });
  },

  'constructor': function () {
    const obj = new Field(2, 3);
    se(obj._width, 2);
    se(obj._height, 3);
    se(obj._data.length, 6)
    se(obj._elements.length, 6);

    istrue(obj._data.every((v) => v === null));

    for (let y = 0; y < 3; ++y) {
      for (let x = 0; x < 2; ++x) {
        istrue(!!obj._elements.find((e) => posEqual(new Position(x, y), e)));
      }
    }
  },

  'methods': {
    beforeEach () {
      obj = new Field(2, 3);
    },

    afterEach () {
      sinon.reset();
    },

    'width': function () {
      obj._width = 'abc';
      se(obj.width, 'abc');
    },

    'height': function () {
      obj._height = 'abc';
      se(obj.height, 'abc');
    },

    'Symbol.iterator': function () {
      obj._elements = [1, 2, 3];

      const data = [...obj];
      se(data.length, 3);
      se(data[0], 1);
      se(data[1], 2);
      se(data[2], 3);
    },

    'at': function () {
      obj._data[2] = 10;
      obj._toOffset_safe = sinon.stub().returns(2);

      se(obj.at(5, 6).value, 10);
      sa.calledOnce(obj._toOffset_safe);
      sa.calledWith(obj._toOffset_safe, 5, 6);
    },

    'atPos': function () {
      obj.at = sinon.stub().returns(10);

      se(obj.atPos(new Position(5, 6)), 10);
      sa.calledOnce(obj.at);
      sa.calledWith(obj.at, 5, 6);
    },

    'atPoses': function () {
      const vec = new Vector(1, 0, 3, 'y');

      const data = [...obj.atPoses(...vec)];
      se(data.length, 3);
      se(data[0], obj.at(1, 0));
      se(data[1], obj.at(1, 1));
      se(data[2], obj.at(1, 2));
    },

    'setAt': function () {
      obj._toOffset_safe = sinon.stub().returns(2);

      obj.setAt(10, 5, 6);
      se(obj._data[2], 10);
      sa.calledOnce(obj._toOffset_safe);
      sa.calledWith(obj._toOffset_safe, 5, 6);
    },

    'setAtPos': function () {
      obj.setAt = sinon.spy();

      obj.setAtPos(11, new Position(3, 4));
      sa.calledOnce(obj.setAt);
      sa.calledWith(obj.setAt, 11, 3, 4);
    },

    'setAtPoses': function () {
      const poses = [
        new Position(3, 4),
        new Position(5, 6),
      ];
      obj.setAt = sinon.spy();

      obj.setAtPoses(10, ...poses);
      sa.callCount(obj.setAt, 2);
      sa.calledWith(obj.setAt.getCall(0), 10, 3, 4);
      sa.calledWith(obj.setAt.getCall(1), 10, 5, 6);
    },

    'isValidPos': function () {
      isValidPos.returns(false);
      isfalse(obj.isValidPos(new Position(1, 1)));

      isValidPos.returns(true);
      isfalse(obj.isValidPos(new Position(-1, 1)));
      isfalse(obj.isValidPos(new Position(1, -1)));
      isfalse(obj.isValidPos(new Position(2, 1)));
      isfalse(obj.isValidPos(new Position(1, 3)));
      istrue (obj.isValidPos(new Position(1, 1)));
    },

    'swap': function () {
      obj._toOffset_safe = sinon.stub();
      obj._toOffset_safe.onCall(0).returns(2);
      obj._toOffset_safe.onCall(1).returns(3);

      obj._data[2] = 20;
      obj._data[3] = 30;
      obj.swap(new Position(), new Position());

      se(obj._data[2], 30);
      se(obj._data[3], 20);
    },

    '_assertPosition': function () {
      assert.throws(() => obj._assertPosition(NaN, 1), { name: 'TypeError' });
      assert.throws(() => obj._assertPosition(1, NaN), { name: 'TypeError' });

      assert.throws(() => obj._assertPosition(-1, 1), { name: 'RangeError' });
      assert.throws(() => obj._assertPosition(1, -1), { name: 'RangeError' });

      assert.throws(() => obj._assertPosition(3, 1), { name: 'RangeError' });
      assert.throws(() => obj._assertPosition(1, 4), { name: 'RangeError' });

      obj._assertPosition(1, 1);
    },

    '_toOffset_safe. throws': function () {
      obj._assertPosition = sinon.stub().throws(new RangeError());
      obj._toOffset = sinon.stub();

      assert.throws(() => obj._toOffset_safe('a', 'b'), { name: 'RangeError' });

      sa.calledOnce(obj._assertPosition);
      sa.calledWith(obj._assertPosition, 'a', 'b');

      sa.notCalled(obj._toOffset);
    },

    '_toOffset_safe. not throws': function () {
      obj._assertPosition = sinon.stub();
      obj._toOffset = sinon.stub().returns(50);

      se(obj._toOffset_safe('a', 'b'), 50);

      sa.calledOnce(obj._assertPosition);
      sa.calledWith(obj._assertPosition, 'a', 'b');

      sa.calledOnce(obj._toOffset);
      sa.calledWith(obj._toOffset, 'a', 'b');
    },

    '_toOffset': function () {
      let offset = 0;
      for (let y = 0; y < obj._height; ++y) {
        for (let x = 0; x < obj._width; ++x) {
          se(obj._toOffset(x, y), offset++);
        }
      }
    },
  },
};
