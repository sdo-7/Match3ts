import GameElement from '../build/GameElement.js';

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
  'constructor': function () {
    const data = {}

    const obj = new GameElement(1, 2, data, 0);
    se(obj._x, 1);
    se(obj._y, 2);
    se(obj._data, data);
    se(obj._offset, 0);
    istrue(!!obj._origCanvasPos);
    istrue(!!obj._canvasPos);
    istrue(obj._origCanvasPos !== obj._canvasPos);
  },

  'x': function () {
    const obj = new GameElement();

    obj._x = 10;
    se(obj.x, 10);
  },

  'y': function () {
    const obj = new GameElement();

    obj._y = 10;
    se(obj.y, 10);
  },

  'value': function () {
    const data = [6, 7, 9, 10, 11, 23];
    const obj = new GameElement(1, 7, data, 3);

    se(obj.value, 10);
  },

  'origCanvasPos': function () {
    const obj = new GameElement();

    se(obj.origCanvasPos, obj._origCanvasPos);
  },

  'canvasPos': function () {
    const obj = new GameElement();

    se(obj.canvasPos, obj._canvasPos);
  },

  'Symbol.toPrimitive': function () {
    const data = [10];
    const obj = new GameElement(1, 2, data, 0);
    obj.origCanvasPos.x = 5;
    obj.origCanvasPos.y = 6;
    obj.canvasPos.x = 7;
    obj.canvasPos.y = 8;

    se('' + obj, `modelPos(1:2):value(10):origCanvasPos(5:6):canvasPos(7:8)`);
    se(`${obj}`, `modelPos(1:2):value(10):origCanvasPos(5:6):canvasPos(7:8)`);
    isnan(+obj);
  },

  'posEquals': function () {
    const obj = new GameElement(1, 2);

    istrue (obj.posEquals({x: 1, y: 2}));
    isfalse(obj.posEquals({x: 1, y: 1}));
    isfalse(obj.posEquals({x: 2, y: 2}));
  },
};
