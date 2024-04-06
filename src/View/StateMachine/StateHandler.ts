import type {IPosition} from '../../Position.ts';
import type GameElement from '../../GameElement.ts';
import type {NewState} from './StateMachine.ts';

export type GameElementGenerator = Generator<GameElement, undefined, undefined>;

export interface IStateHandler {
  onEnable (): void;
  onDisable (): void;
  update (): NewState;
  onMouseDown (e: MouseEvent, mousePos: IPosition): NewState;
  onMouseUp (e: MouseEvent, mousePos: IPosition): NewState;
  onMouseMove (e: MouseEvent, mousePos: IPosition): NewState;
  isElementInAction (modelPos: IPosition): boolean;
  getActionElements (): GameElementGenerator;
}

export default class StateHandler implements IStateHandler {
  protected _updateRequired: boolean = false;

  get updateRequired () {
    return this._updateRequired;
  }

  onEnable (): void {
  }

  onDisable (): void {
  }

  update (): NewState {
  }

  onMouseDown (e: MouseEvent, mousePos: IPosition): NewState {
  }

  onMouseUp (e: MouseEvent, mousePos: IPosition): NewState {
  }

  onMouseMove (e: MouseEvent, mousePos: IPosition): NewState {
  }

  isElementInAction (modelPos: IPosition): boolean {
    return false;
  }

  *getActionElements (): GameElementGenerator {
  }
}
