import type {IPosition} from '../Position.ts';
import type ViewImpl from './ViewImpl.ts';
import Position from '../Position.js';
import GameElement from '../GameElement.js';

export default class Elements_first {
  private _element: GameElement | null;
  private _modelPos: Position;
  private _delta: Position;

  constructor (private _impl: ViewImpl) {
    this._element = null;
    this._modelPos = new Position();
    this._delta = new Position();
  }

  get element (): GameElement {
    return this._element!;
  }

  get delta () {
    return this._delta;
  }

  get empty () {
    const empty = !this._element;
    return empty;
  }

  reset (): void {
    if (this._element) {
      this._element.canvasPos.fromPos(this._element.origCanvasPos);
      this._element.alpha = 100;
    }
    this._element = null;

    this._modelPos.reset();
    this._delta.reset();
  }

  calcModelPos (mousePos: IPosition): void {
    this._impl.calculations.mouseToModelPos(mousePos, this._modelPos);
    this._element = this._impl.model!.atPos(this._modelPos) ?? null;
    if (!this._element)
      this._modelPos.reset();
  }

  calcDelta (mousePos: IPosition): void {
    this._impl.calculations.mouseToDeltaPos(mousePos, this._element!.origCanvasPos, this._delta);
  }

  calcFromDelta (): void {
    const element = this._element!;
    element.canvasPos.fromPos(element.origCanvasPos);
    element.canvasPos.add(this._delta);
  }
}
