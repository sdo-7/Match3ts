import type Impl from '../ViewImpl.ts';
import StateHandler from './StateHandler.js';
import ChangeStateHandler from './ChangeStateHandler.js';
import IdleStateHandler from './IdleStateHandler.js';
import MouseStateHandler from './MouseStateHandler.js';
import SwapStateHandler from './SwapStateHandler.js';
import MasterHandler from './MasterHandler.js';

export type State = 'change' | 'idle' | 'mouse' | 'swap';
export type NewState = State | void;

export type StateHandlers = {
  [key in State]: StateHandler;
}

export default class StateMachine {
  private _master: MasterHandler;

  constructor (impl: Impl) {
    const handlers = {
      'change': new ChangeStateHandler(impl),
      'idle': new IdleStateHandler(impl),
      'mouse': new MouseStateHandler(impl),
      'swap': new SwapStateHandler(impl),
    };
    this._master = new MasterHandler(handlers, 'idle');
  }

  get current (): StateHandler {
    return this._master;
  }

  set current (state: State) {
    this._master.current = state;
  }

  reset (): void {
    this.current = 'idle';
  }
}
