import type {IPosition} from '../Position.ts';
import type {GameElementGenerator} from '../GameElement.ts';
import type ModelImpl from './ModelImpl.ts';
import Position from '../Position.js';
import Vector from '../Vector.js';
import GameElement, {Value} from '../GameElement.js';

type PositionVariable = keyof IPosition;

export default class Matches {
  constructor (private _impl: ModelImpl,
               private _matchLength: number) {
  }

  isAnyMatchAt (x: number, y: number): boolean {
    const match = this._isHMatchAt(x, y) ||
                  this._isVMatchAt(x, y);
    return match;
  }

  isAnyMatchAtPos (pos: IPosition): boolean {
    const match = this.isAnyMatchAt(pos.x, pos.y);
    return match;
  }

  *getMatchesAtPoses (...poses: IPosition[]): GameElementGenerator {
    for (const pos of poses) {
      yield* this._getMatchesAt(pos.x, pos.y);
    }
  }

  *getAllMatches (): GameElementGenerator {
    yield* this._getAllHMatches();
    yield* this._getAllVMatches();
  }

  private _getMatchStart (x: number, y: number, varName: PositionVariable, value: Value): Position {
    const pos = new Position(x, y);

    while (pos[varName] > 0) {
      --pos[varName];

      const curValue = this._impl.field.atPos(pos).value;
      if (curValue !== value) {
        ++pos[varName];
        break;
      }
    }

    return pos;
  }

  private _getMatchEnd (x: number, y: number, varName: PositionVariable, value: Value, limit: number): Position {
    const pos = new Position(x, y);
    --limit;
    while (pos[varName] < limit) {
      ++pos[varName];

      const curValue = this._impl.field.atPos(pos).value;
      if (curValue !== value) {
        --pos[varName];
        break;
      }
    }

    return pos;
  }

  private *_getMatchAt (x: number, y:number, varName: PositionVariable, limit: number): GameElementGenerator {
    const value = this._impl.field.at(x, y).value;
    if (value === null)
      return;

    const start = this._getMatchStart(x, y, varName, value);
    const end   = this._getMatchEnd  (x, y, varName, value, limit);
    const vec   = new Vector(start, end, varName);

    const match = vec.length >= this._matchLength;
    if (!match)
      return;

    yield* this._impl.field.atPoses(...vec);
  }

  private _getMatchAtPos (pos: IPosition, varName: PositionVariable, limit: number): GameElementGenerator {
    return this._getMatchAt(pos.x, pos.y, varName, limit);
  }

  private _isMatchAt (x: number, y:number, varName: PositionVariable, limit: number): boolean {
    const match = !this._getMatchAt(x, y, varName, limit).next().done;
    return match;
  }

  private _isHMatchAt (x: number, y: number): boolean {
    const match = this._isMatchAt(x, y, 'x', this._impl.field.width);
    return match;
  }

  private _isVMatchAt (x: number, y: number): boolean {
    const match = this._isMatchAt(x, y, 'y', this._impl.field.height);
    return match;
  }

  private _getHMatchAt (x: number, y: number): GameElementGenerator {
    return this._getMatchAt(x, y, 'x', this._impl.field.width);
  }

  private _getVMatchAt (x: number, y: number): GameElementGenerator {
    return this._getMatchAt(x, y, 'y', this._impl.field.height);
  }

  private *_getMatchesAt (x: number, y: number): GameElementGenerator {
    yield* this._getHMatchAt(x, y);
    yield* this._getVMatchAt(x, y);
  }

  private *_getAllMatchesForLine (pos: IPosition, varName: PositionVariable, limit: number): GameElementGenerator {
    pos[varName] = 0;

    for (let end = (limit - this._matchLength + 1); pos[varName] < end;) {
      const matches: GameElement[] = [...this._getMatchAtPos(pos, varName, limit)];
      yield* matches;

      const length = matches.length;
      pos[varName] += length ? length : 1;
    }
  }

  private *_getAllHMatches (): GameElementGenerator {
    const pos = new Position();
    for (let y = 0; y < this._impl.field.height; ++y) {
      pos.y = y;
      yield* this._getAllMatchesForLine(pos, 'x', this._impl.field.width);
    }
  }

  private *_getAllVMatches (): GameElementGenerator {
    const pos = new Position();
    for (let x = 0; x < this._impl.field.width; ++x) {
      pos.x = x;
      yield* this._getAllMatchesForLine(pos, 'y', this._impl.field.height);
    }
  }
}
