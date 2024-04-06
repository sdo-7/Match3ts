import type {IPosition} from '../../Position.ts';
import type GameElement from '../../GameElement.ts';
import type {NewState} from './StateMachine.ts';
import type Impl from '../ViewImpl.ts';
import {MouseButtonToHandle, MouseButtonToHandleMask} from '../MouseHandler.js';
import StateHandler from './StateHandler.js';

export default class MouseStateHandler extends StateHandler {
  constructor (private _viewImpl: Impl) {
    super();
    this._updateRequired = true;
  }

  onMouseDown (e: MouseEvent, mousePos: IPosition): NewState {
    if (e.button !== MouseButtonToHandle)
      return;

    this._recalc(mousePos);
  }

  onMouseUp (e: MouseEvent, mousePos: IPosition): NewState {
    if (e.button !== MouseButtonToHandle)
      return;

    return 'idle';
  }

  onMouseMove (e: MouseEvent, mousePos: IPosition): NewState {
    if (!(e.buttons & MouseButtonToHandleMask))
      return 'idle';

    this._recalc(mousePos);

    const second = this._viewImpl.elements.second;
    const overSecond = !!(second.element &&
                          this._viewImpl.calculations.isPosInCell(mousePos, second.element.origCanvasPos));
    if (overSecond)
      return 'swap';
  }

  isElementInAction (modelPos: IPosition): boolean {
    const inAction = this._viewImpl.elements.first.element.posEquals(modelPos);
    return inAction;
  }

  *getActionElements (): Generator<GameElement> {
    yield this._viewImpl.elements.first.element;
  }

  private _recalc (mousePos: IPosition): void {
    const first = this._viewImpl.elements.first;
    const second = this._viewImpl.elements.second;

    first.calcDelta(mousePos);
    first.calcFromDelta();
    second.calc();
  }
}
