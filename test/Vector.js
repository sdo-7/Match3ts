import Vector from '../build/Vector.js';
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

export default {
  'constructor. no args': function () {
    const obj = new Vector();

    isnan(obj.x);
    isnan(obj.y);
    isnan(obj.length);
    se(obj.variable, undefined);
  },

  'constructor. x y': function () {
    const obj = new Vector(1, 2);

    se(obj.x, 1);
    se(obj.y, 2);
    isnan(obj.length);
    se(obj.variable, undefined);
  },

  'constructor. x y length variable': function () {
    const obj = new Vector(1, 2, 3, 'x');

    se(obj.x, 1);
    se(obj.y, 2);
    se(obj.length, 3);
    se(obj.variable, 'x');
  },

  'constructor. start end variable': function () {
    const a = new Position(1, 2);
    const b = new Position(5, 3);
    const obj = new Vector(a, b, 'x');

    se(obj.x, 1);
    se(obj.y, 2);
    se(obj.length, 5);
    se(obj.variable, 'x');
  },

  'constructor. RangeError': function () {
    const a = new Position(5, 2);
    const b = new Position(4, 3);

    assert.throws(() => new Vector(a, b, 'x'), { name: 'RangeError' });
  },

  'validity': function () {
    const obj = new Vector();

    isfalse(obj.validity);

    obj.x = 10;
    obj.y = 20;
    isfalse(obj.validity);

    obj.length = 30;
    isfalse(obj.validity);

    obj.variable = 'x';
    istrue(obj.validity);

    obj.x = NaN;
    isfalse(obj.validity);
    obj.x = 10;

    obj.y = NaN;
    isfalse(obj.validity);
    obj.y = 20;

    obj.length = NaN;
    isfalse(obj.validity);
    obj.length = 30;
  },

  'Symbol.toPrimitive': function () {
    const obj = new Vector(1, 2, 3, 'x');
    se('' + obj, '1:2:3:x');
    se(`${obj}`, '1:2:3:x');
    isnan(+obj);
  },

  'Symbol.iterator. empty': function () {
    const obj = new Vector();

    const data = [...obj];
    se(data.length, 0);
  },

  'Symbol.iterator. not empty': function () {
    const obj = new Vector(10, 2, 3, 'x');

    const data = [...obj];
    se(data.length, 3);
    se(data[0].x, 10);
    se(data[0].y, 2);
    se(data[1].x, 11);
    se(data[1].y, 2);
    se(data[2].x, 12);
    se(data[2].y, 2);
  },

  'reset': function () {
    const obj = new Vector(1, 2, 3, 'x');

    obj.reset();
    isnan(obj.x);
    isnan(obj.y);
    isnan(obj.length);
    se(obj.variable, undefined);
  },
};
