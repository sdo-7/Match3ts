import type {Parent} from './Widget.ts';
import type Model from './Model.ts';
import Widget from './Widget.js';
import ViewImpl from './View/ViewImpl.js';

export default class View extends Widget {
  private _impl: ViewImpl;

  constructor (parent: Parent,
               canvas: HTMLCanvasElement) {
    super(parent);
    this._impl = new ViewImpl(parent, canvas);
  }

  set model (model: Model | null | undefined) {
    model = model ?? null;

    if (this._impl.model === model)
      return;

    if (this._impl.model) {
      this._impl.mouseHandler.disable();
      this._impl.elements.reset();
      this._impl.stateMachine.reset();
      this._impl.animations.reset();
      this._impl.calculations.reset();
      this._impl.drawing.reset();

      const curModel = this._impl.model;
      this._impl.model = null;
      curModel.view = null;
    }

    if (!model)
      return;

    this._impl.model = model;
    model.view = this;

    this._impl.calculations.recalc();
    this._impl.drawing.recalc();
    this._impl.elements.prepareElements();
    this._impl.mouseHandler.enable();
  }

  get model (): Model | null {
    return this._impl.model;
  }

  get cellHeight (): number {
    return this._impl.calculations.cellSize.height;
  }

  update (td: number): void {
    this._impl.animations.update(td);
    this._impl.stateMachine.current.update();
    this._impl.drawing.draw();

    this._impl.updater.requestIfNeeded();
  }
}
