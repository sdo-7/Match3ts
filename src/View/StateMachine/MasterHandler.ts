import type {IPosition} from '../../Position.ts';
import type {State, NewState, StateHandlers} from './StateMachine.ts';
import type {IStateHandler, GameElementGenerator} from './StateHandler.ts';
import StateHandler from './StateHandler.js';

type StateHandlerKey = keyof IStateHandler;

export default class MasterHandler extends StateHandler {
  constructor (private _handlers: StateHandlers,
               private _state: State) {
    super();
    this._current.onEnable();
  }

  override get updateRequired () {
    const required = this._current.updateRequired;
    return required;
  }

  set current (state: State) {
    if (!state)
      return;
    if (this._state === state)
      return;

    // TODO pass new state name
    this._current.onDisable();

    this._state = state;
    this._current.onEnable();
  }

  private get _current (): StateHandler {
    const handler = this._handlers[this._state];
    return handler;
  }

  update (): NewState {
    this._callHandler('update');
  }

  onMouseDown (e: MouseEvent, mousePos: IPosition): NewState {
    this._callHandler('onMouseDown', e, mousePos);
  }

  onMouseUp (e: MouseEvent, mousePos: IPosition): NewState {
    this._callHandler('onMouseUp', e, mousePos);
  }

  onMouseMove (e: MouseEvent, mousePos: IPosition): NewState {
    this._callHandler('onMouseMove', e, mousePos);
  }

  isElementInAction (modelPos: IPosition): boolean {
    const inAction = this._current.isElementInAction(modelPos);
    return inAction;
  }

  getActionElements (): GameElementGenerator {
    return this._current.getActionElements();
  }

  private _callHandler (key: StateHandlerKey, ...args: any[]) {
    for (;;) {
      const current = this._current;
      const newState = current[key].apply(current, args);
      if (!newState)
        break;

      this.current = newState;
    }
  }
}
