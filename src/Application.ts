import Widget from './Widget.js';

export type RequestUpdate = () => void;

export default class Application extends Widget {
  private _requestEnqueued: boolean;
  private _timeStamp: number;

  constructor () {
    super(null);
    this._requestEnqueued = false;
  }

  requestUpdate (): void {
    if (this._requestEnqueued)
      return;

    this._requestEnqueued = true;
    window.requestAnimationFrame(this.onFrame);
  }

  onFrame = (time: number): void => {
    const dt = time - this._timeStamp;
    this._timeStamp = time;
    this._requestEnqueued = false;

    this.update(dt);
  }
}
