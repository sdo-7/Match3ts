import type ViewImpl from './ViewImpl.ts';
import GameElement from '../GameElement.js';
import Position from '../Position.js';

export default class Elements_second {
  private _element: GameElement | null;
  private _modelPos: Position;

  constructor (private _impl: ViewImpl) {
    this._element = null;
    this._modelPos = new Position();
  }

  get element () {
    return this._element;
  }

  reset (): void {
    if (this._element) {
      this._element.canvasPos.fromPos(this._element.origCanvasPos);
      this._element.alpha = 100;
    }
    this._element = null;

    this._modelPos.reset();
  }

  calc (): void {
    this._setElement();

    const element = this._element;
    if (!element)
      return;

    element.canvasPos.fromPos(element.origCanvasPos);
    element.canvasPos.sub(this._impl.elements.first.delta);
  }

  private _setElement (): void {
    const first = this._impl.elements.first;
    this._impl.calculations.deltaToModelPos(first.element!, first.delta, this._modelPos);

    const leavingElement = !!(this._element && !this._modelPos.posEquals(this._element));
    if (leavingElement)
      this._element!.canvasPos.fromPos(this._element!.origCanvasPos);

    this._element = this._impl.model!.atPos(this._modelPos) ?? null;
  }
}
