import type ViewImpl from './ViewImpl.ts';

export default class Updater {
  constructor (private _impl: ViewImpl) {
  }

  requestIfNeeded (): void {
    const needed = this._impl.stateMachine.current.updateRequired;
    if (!needed)
      return;

    this._impl.parent?.requestUpdate();
  }
}
