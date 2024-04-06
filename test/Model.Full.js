import Model from '../build/Model.js';
import Position from '../build/Position.js';
import SwapChange from '../build/Changes/SwapChange.js';
import MatchChange from '../build/Changes/MatchChange.js';
import MoveDownChange from '../build/Changes/MoveDownChange.js';

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

let model;

const expectedValues = [
  1, 2, 3, 4, 5,
  2, 1, 4, 3, 5,
  4, 2, 1, 5, 3,
  5, 3, 5, 3, 3,
  3, 2, 1, 2, 1,
];
let modelElements;

function compareValues () {
  const a = expectedValues;
  const b = modelElements;

  if (a.length !== b.length)
    istrue(false);

  for (let offset = 0; offset < a.length; ++offset)
    se(a[offset], b[offset].value);
}

function dump (data) {
  for (let y = 0; y < 5; ++y) {
    const offset = y * 5;
    console.log(`${data[offset + 0]}, ${data[offset + 1]}, ${data[offset + 2]}, ${data[offset + 3]}, ${data[offset + 4]}, `)
  }
}

expectedValues.dump = function () {
  dump(this);
}

function dumpAll () {
  console.log('expected values');
  expectedValues.dump();
  console.log('model values');
  model.dump();
}

const CanvasMock = sinon.spy(class {
});

export default {
  'model construction': function () {
    const srcData = [
      1, 2, 3, 4, 5,
      2, 1, 4, 3, 5,
      4, 2, 1, 5, 3,
      5, 3, 5, 3, 3,
      3, 2, 1, 2, 3,

      1,
      4,3,4,4,4,1,
      1,2,3,4,5,1,
    ];
    let offset = 0;
    const getNextValue = function () {
      return srcData[offset++];
    }

    model = new Model(5, 5, 3, getNextValue);
    modelElements = [...model];
    model.dump = function () {
      const data = [...this].map((e) => e.value);
      dump(data);
    }
  },

  'init': function () {
    model.init();

    compareValues();
  },

  'fail swap': function () {
    const a = new Position(0, 0);
    const b = new Position(1, 0);
    model.swap(a, b);

    compareValues();
    istrue(model.change instanceof SwapChange);
    istrue(model.change.contains(a));
    istrue(model.change.contains(b));

    const els = [...model.change.elements];
    istrue(els[0].posEquals(b));
    istrue(els[1].posEquals(a));

    model.change.apply();

    const animation = model.change.createAnimation(100);
    istrue(!!animation);
    // TODO check animation

    model.change.finish();
    isfalse(!!model.change);
  },

  'swap': function () {
    const a = new Position(3, 2);
    const b = new Position(4, 2);
    model.swap(a, b);

    compareValues();
    istrue(model.change instanceof SwapChange);
    istrue(model.change.contains(a));
    istrue(model.change.contains(b));

    const els = [...model.change.elements];
    istrue(els[0].posEquals(b));
    istrue(els[1].posEquals(a));

    model.change.apply();

    istrue(!!model.change);
    istrue(model.change instanceof MatchChange);
  },

  'MatchChange': function () {
    istrue(model.change.contains(new Position(4, 0)));
    istrue(model.change.contains(new Position(4, 1)));
    istrue(model.change.contains(new Position(4, 2)));
    istrue(model.change.contains(new Position(3, 1)));
    istrue(model.change.contains(new Position(3, 2)));
    istrue(model.change.contains(new Position(3, 3)));
    se([...model.change.elements].length, 6);

    expectedValues[13] = 3;
    expectedValues[14] = 5;
    compareValues();

    const animation = model.change.createAnimation(100);
    istrue(!!animation);
    // TODO check animation

    model.change.finish();
    istrue(!!model.change);
    istrue(model.change instanceof MoveDownChange);
  },

  'MoveDownChange': function () {
    // TODO check elements and contains()

    model.change.apply();

    expectedValues[4] = 3;
    expectedValues[8] = 4;
    expectedValues[9] = 4;
    expectedValues[13] = 4;
    expectedValues[14] = 1;
    expectedValues[18] = 4;
    compareValues();

    // TODO check animation

    model.change.finish();
    istrue(!!model.change);
    istrue(model.change instanceof MatchChange);
  },

  'MatchChange 2': function () {
    model.change.apply();

    model.change.finish();
    istrue(!!model.change);
    istrue(model.change instanceof MoveDownChange);
  },

  'MoveDownChange 2': function () {
    model.change.apply();

    expectedValues[2] = 1;
    expectedValues[3] = 2;
    expectedValues[4] = 3;
    expectedValues[7] = 3;
    expectedValues[8] = 4;
    expectedValues[9] = 3;
    expectedValues[13] = 5;
    expectedValues[18] = 1;
    compareValues();

    model.change.finish();
    isfalse(!!model.change);
  },
};
