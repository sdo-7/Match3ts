import * as Numbers from '../build/Numbers.js';

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
  'tonumber': function () {
    se(Numbers.tonumber(0), 0);
    se(Numbers.tonumber(1), 1);
    isnan(Numbers.tonumber(NaN));
    isnan(Numbers.tonumber('abc'));
    isnan(Numbers.tonumber('1'));
  },

  'isnan': function () {
    isfalse(Numbers.isnan(0));
    isfalse(Numbers.isnan(1));
    istrue(Numbers.isnan(NaN));
    istrue(Numbers.isnan('abc'));
    istrue(Numbers.isnan('1'));
  },

  'notnan': function () {
    istrue(Numbers.notnan(0));
    istrue(Numbers.notnan(1));
    isfalse(Numbers.notnan(NaN));
    isfalse(Numbers.notnan('abc'));
    isfalse(Numbers.notnan('1'));
  },
};
