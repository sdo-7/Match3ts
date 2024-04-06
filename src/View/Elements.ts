import type {GameElementGenerator} from '../GameElement.ts';
import type ViewImpl from './ViewImpl.js';
import GameElement from '../GameElement.js';
import First from './Elements_first.js';
import Second from './Elements_second.js';

export default class Elements {
  private _first: First;
  private _second: Second;

  constructor (private _impl: ViewImpl) {
    this._first = new First(_impl);
    this._second = new Second(_impl);
  }

  get first () {
    return this._first;
  }

  get second () {
    return this._second;
  }

  get actionElements (): GameElementGenerator {
    return this._getActionElements();
  }

  get idleElements (): GameElementGenerator {
    return this._getIdleElements();
  }

  reset (): void {
    this._first.reset();
    this._second.reset();

    for (const element of this._impl.model!)
      element.reset();
  }

  prepareElements (): void {
    for (const element of this._impl.model!) {
      this._impl.calculations.modelToCanvasPos(element, element.origCanvasPos);
      element.canvasPos.fromPos(element.origCanvasPos);
      element.alpha = 100;
    }
  }

  private *_getActionElements (): GameElementGenerator {
    yield* this._impl.stateMachine.current.getActionElements();
  }

  private *_getIdleElements (): GameElementGenerator {
    const idlePredicate = (element: GameElement) => !this._impl.stateMachine.current.isElementInAction(element);
    const controllers = [...this._impl.model!].filter(idlePredicate);
    yield* controllers;
  }
}
