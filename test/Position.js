import Position, {
  isValidPos,
  copyPosFromTo,
  resetPos,
  posEqual,
  addPosition,
  subPosition,
  posToPrimitive,
} from '../build/Position.js';

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
  'isValidPos': function () {
    istrue (isValidPos({x:  1, y:  2}));
    isfalse(isValidPos({x:NaN, y:  2}));
    isfalse(isValidPos({x:  1, y:NaN}));
    isfalse(isValidPos({x:NaN, y:NaN}));
  },

  'copyPosFromTo': function () {
    const dst = {};

    copyPosFromTo({x:   1, y:   2}, dst);
    se(dst.x, 1);
    se(dst.y, 2);

    copyPosFromTo({x:   1, y: 'b'}, dst);
    se(dst.x, 1);
    isnan(dst.y);

    copyPosFromTo({x: 'a', y:   2}, dst);
    isnan(dst.x);
    se(dst.y, 2);

    copyPosFromTo({x: 'a', y: 'b'}, dst);
    isnan(dst.x);
    isnan(dst.y);
  },

  'resetPos': function () {
    const dst = {};

    resetPos(dst);
    isnan(dst.x);
    isnan(dst.y);
  },

  'posEqual': function () {
    istrue (posEqual({x: 1, y: 2}, {x: 1, y: 2}));
    isfalse(posEqual({x: 1, y: 2}, {x: 1, y: 4}));
    isfalse(posEqual({x: 1, y: 2}, {x: 3, y: 2}));
    isfalse(posEqual({x: 1, y: 2}, {x: 3, y: 4}));
  },

  'addPosition': function () {
    const src = {x:  3, y:  4};
    const dst = {x: 10, y: 20};

    addPosition(src, dst);
    se(src.x,  3);
    se(src.y,  4);
    se(dst.x, 13);
    se(dst.y, 24);
  },

  'subPosition': function () {
    const src = {x:  3, y:  4};
    const dst = {x: 10, y: 20};

    subPosition(src, dst);
    se(src.x,  3);
    se(src.y,  4);
    se(dst.x,  7);
    se(dst.y, 16);
  },

  'posToPrimitive': function () {
    const pos = {x: 1, y: 2};

    se(posToPrimitive(pos), '1:2');
    se(posToPrimitive(pos, 'default'), '1:2');
    se(posToPrimitive(pos, 'string'), '1:2');
    isnan(posToPrimitive(pos, 'number'));
  },

  'constructor. no args': function () {
    const pos = new Position();
    isnan(pos.x);
    isnan(pos.y);
  },

  'constructor. x y': function () {
    const pos = new Position(1, 2);
    se(pos.x, 1);
    se(pos.y, 2);
  },

  'constructor. IPosition': function () {
    const src = {x: 10, y: 20};
    const pos = new Position(src);
    se(pos.x, 10);
    se(pos.y, 20);
  },

  'validity': function () {
    let pos = new Position();
    isfalse(pos.validity);

    pos = new Position(1, 2);
    istrue(pos.validity);
  },

  'Symbol.toPrimitive': function () {
    const pos = new Position(1, 2);

    se('' + pos, '1:2');
    se(`${pos}`, '1:2');
    isnan(+pos);
  },

  'setPos': function () {
    const pos = new Position();

    pos.setPos(1, 2);
    se(pos.x, 1);
    se(pos.y, 2);
  },

  'fromPos': function () {
    const pos = new Position();

    pos.fromPos({x: 1, y: 2});
    se(pos.x, 1);
    se(pos.y, 2);
  },

  'swapPos': function () {
    const a = new Position(1, 2);
    const b = new Position(3, 4);
    a.swapPos(b);

    se(a.x, 3);
    se(a.y, 4);
    se(b.x, 1);
    se(b.y, 2);
  },

  'reset': function () {
    const pos = new Position(1, 2);

    pos.reset();
    isnan(pos.x);
    isnan(pos.y);
  },

  'posEquals': function () {
    const pos = new Position(1, 2);

    istrue (pos.posEquals({x: 1, y: 2}));
    isfalse(pos.posEquals({x: 3, y: 4}));
  },

  'add': function () {
    const pos  = new Position( 1,  2);
    const that = new Position(10, 20);

    pos.add(that);
    se( pos.x, 11);
    se( pos.y, 22);
    se(that.x, 10);
    se(that.y, 20);
  },

  'sub': function () {
    const pos  = new Position(10, 20);
    const that = new Position( 3,  4);

    pos.sub(that);
    se( pos.x,  7);
    se( pos.y, 16);
    se(that.x,  3);
    se(that.y,  4);
  },
};
