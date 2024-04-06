import type ViewImpl from './ViewImpl.js';
import Rect from '../Rect.js';
import GameElement from '../GameElement.js';
import Drawers from './Drawers.js';

export default class Drawing {
  private _elementRect: Rect;

  constructor (private _impl: ViewImpl,
               private _ctx: CanvasRenderingContext2D) {
    this._elementRect = new Rect();
  }

  reset (): void {
    this._elementRect.reset();
  }

  recalc (): void {
    this._elementRect.fromSize(this._impl.calculations.cellSize);
  }

  onResize (): void {
    this.recalc();
  }

  draw (): void {
    this._drawBackground();
    this._drawElements(this._impl.elements.idleElements);
    this._drawElements(this._impl.elements.actionElements);
  }

  private _drawBackground (): void {
    const width = this._impl.canvas.width;
    const height = this._impl.canvas.height;

    this._ctx.clearRect(0, 0, width, height);
    this._ctx.lineWidth = 1;
    this._ctx.strokeStyle = '#424242';
    this._ctx.strokeRect(0, 0, width, height);
  }

  private _drawElements (elements: Iterable<GameElement>): void {
    const rect = this._elementRect;

    for (const element of elements) {
      rect.fromPos(element.canvasPos);

      const drawer = Drawers[element.value!];
      drawer(this._ctx, rect, element.alpha);
    }
  }
}
