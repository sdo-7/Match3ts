import type Position from '../../Position.ts';
import type {NewState} from './StateMachine.ts';
import type Impl from '../ViewImpl.ts';
import {MouseButtonToHandle} from '../MouseHandler.js';
import StateHandler from './StateHandler.js';

export default class IdleStateHandler extends StateHandler {
  constructor (private _viewImpl: Impl) {
    super();
  }

  onEnable (): void {
    // TODO move from here into onDisable of another handlers
    this._viewImpl.elements.first.reset();
    this._viewImpl.elements.second.reset();
  }

  update (): NewState {
    const changeInModel = !!this._viewImpl.model!.change;
    if (changeInModel)
      return 'change';
  }

  onMouseDown (e: MouseEvent, mousePos: Position): NewState {
    if (e.button !== MouseButtonToHandle)
      return;

    const first = this._viewImpl.elements.first;
    first.calcModelPos(mousePos);
    if (first.empty)
      return;

    return 'mouse';
  }
}
