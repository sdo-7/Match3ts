export type OnUpdate = (value: number, arg: any, animation: Animation) => void;
export type OnFinish = (arg: any, animation: Animation) => void;

export interface AnimationOptions {
  thisArg?: object;
  arg?: any;
  onUpdate?: OnUpdate;
  onFinish?: OnFinish;
}

export default class Animation {
  private _done: boolean;

  constructor (protected _current: any,
               protected _thisArg?: object,
               protected _arg?: any,
               protected _onUpdate?: OnUpdate,
               protected _onFinish?: OnFinish) {
    this._done = false;
  }

  get done () {
    return this._done;
  }

  set done (done: boolean) {
    if (this._done)
      return;

    this._done = done;
  }

  cancel (): void {
    this.done = true;
  }

  update (td: number): void {
  }

  finish (): void {
    this._callOnFinish();
  }

  protected _callOnUpdate (): void {
    this._onUpdate?.call(this._thisArg, this._current, this._arg, this);
  }

  protected _callOnFinish (): void {
    this._onFinish?.call(this._thisArg, this._arg, this);
  }
}
