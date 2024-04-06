import type {IPosition} from '../Position.ts';
import Position from '../Position.js';
import ViewImpl from './ViewImpl.js';

export const MouseButtonToHandle = 0;
export const MouseButtonToHandleMask = 1 << MouseButtonToHandle;
const mouseHandlingNames = {
  'mousedown': 'onMouseDown',
  'mouseup': 'onMouseUp',
  'mousemove': 'onMouseMove',
};
const eventListenerOptions = {
  passive: true,
};

export default class MouseHandler {
  constructor (private _impl: ViewImpl) {
  }

  handleEvent (e: MouseEvent): void {
    const currentHandler = this._impl.stateMachine.current;
    const methodName = mouseHandlingNames[e.type];
    const mousePos = this._toMousePos(e);

    currentHandler[methodName](e, mousePos);

    this._impl.updater.requestIfNeeded();
  }

  enable (): void {
    for (const eventName of Object.keys(mouseHandlingNames))
      this._impl.canvas.addEventListener(eventName, this, eventListenerOptions);
  }

  disable (): void {
    for (const eventName of Object.keys(mouseHandlingNames))
      this._impl.canvas.removeEventListener(eventName, this, eventListenerOptions as EventListenerOptions);
  }

  private _toMousePos (e: MouseEvent): IPosition {
    const mousePos = new Position(e.offsetX, e.offsetY);
    return mousePos;
  }
}
