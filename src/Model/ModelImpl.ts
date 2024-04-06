import type View from '../View.ts';
import type {GetNextValue} from './Field.ts';
import Field from './Field.js';
import Matches from './Matches.js';
import Changes from './Changes.js';

export default class ModelImpl {
  field: Field;
  matches: Matches;
  changes: Changes;
  view: View | null;
  getNextValue: GetNextValue;

  constructor (width: number,
               height: number,
               matchLength: number,
               getNextValue: GetNextValue) {
    this.field = new Field(width, height);
    this.matches = new Matches(this, matchLength);
    this.changes = new Changes();
    this.view = null;
    this.getNextValue = getNextValue;
  }
}
