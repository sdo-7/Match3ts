import type {IPosition} from '../Position.ts';
import type ViewImpl from './ViewImpl.js';
import {copyPosFromTo, resetPos} from '../Position.js';
import Size from '../Size.js';

export default class Calculations {
  private _cellSize: Size;

  constructor (private _impl: ViewImpl) {
    this._cellSize = new Size();
  }

  get cellSize (): Size {
    return this._cellSize;
  }

  reset (): void {
    this._cellSize.reset();
  }

  recalc (): void {
    const model = this._impl.model!;
    const canvas = this._impl.canvas;
    const w = canvas.width / model.width;
    const h = canvas.height / model.height;

    this._cellSize.setSize(w, h);
  }

  onResize (): void {
    this.recalc();
  }

  mouseToModelPos (mousePos: IPosition, modelPos: IPosition): void {
    modelPos.x = Math.trunc(mousePos.x / this._cellSize.width);
    modelPos.y = Math.trunc(mousePos.y / this._cellSize.height);
  }

  modelToCanvasPos (modelPos: IPosition, canvasPos: IPosition): void {
    canvasPos.x = this._cellSize.width * modelPos.x;
    canvasPos.y = this._cellSize.height * modelPos.y;
  }

  mouseToDeltaPos (mousePos: IPosition, canvasPos: IPosition, delta: IPosition): void {
    const cx = canvasPos.x + this._cellSize.width/2;
    const cy = canvasPos.y + this._cellSize.height/2;

    delta.x = mousePos.x - cx;
    delta.y = mousePos.y - cy;

    const factorX = Math.abs(delta.x / this._cellSize.width);
    const factorY = Math.abs(delta.y / this._cellSize.height);

    if (factorX >= factorY)
      delta.y = 0;
    else
      delta.x = 0;
  }

  deltaToModelPos (srcModelPos: IPosition, delta: IPosition, modelPos: IPosition): void {
    copyPosFromTo(srcModelPos, modelPos);

    if (delta.x === 0 && delta.y === 0)
      return;

    modelPos.x += (delta.x < 0) ? -1 : ((delta.x > 0) ? 1 : 0);
    modelPos.y += (delta.y < 0) ? -1 : ((delta.y > 0) ? 1 : 0);

    if (!this._impl.model!.isValidPos(modelPos))
      resetPos(modelPos);
  }

  isPosInCell (mousePos: IPosition, cellCanvasPos: IPosition): boolean {
    if (mousePos.x < cellCanvasPos.x ||
        mousePos.y < cellCanvasPos.y)
      return false;

    if (mousePos.x >= (cellCanvasPos.x + this._cellSize.width) ||
        mousePos.y >= (cellCanvasPos.y + this._cellSize.height))
      return false;

    return true;
  }
}
