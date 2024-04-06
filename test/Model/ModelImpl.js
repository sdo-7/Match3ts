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
const Field = sinon.spy(class {});
const Matches = sinon.spy(class {});
const Changes = sinon.spy(class {});
const ModelImpl = await esmock('../../build/Model/ModelImpl.js', {
  '../../build/Model/Field.js': {
    default: Field,
  },
  '../../build/Model/Matches.js': {
    default: Matches,
  },
  '../../build/Model/Changes.js': {
    default: Changes,
  },
});

export default {
  'constructor': function () {
    const obj = new ModelImpl(10, 20, 30, 40);

    istrue(obj.field instanceof Field);
    sa.calledOnce(Field);
    sa.calledWithNew(Field);
    sa.calledWith(Field, 10, 20);

    istrue(obj.matches instanceof Matches);
    sa.calledOnce(Matches);
    sa.calledWithNew(Matches);
    sa.calledWith(Matches, obj, 30);

    istrue(obj.changes instanceof Changes);
    sa.calledOnce(Changes);
    sa.calledWithNew(Changes);

    se(obj.view, null);

    se(obj.getNextValue, 40);
  },
};
