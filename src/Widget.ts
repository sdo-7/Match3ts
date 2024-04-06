export interface IWidget {
  addChild (child: IWidget): void;
  removeChild (child: IWidget): void;
  requestUpdate (): void;
  update (dt: number): void;
}

export type Parent = IWidget | null | undefined;

export default class Widget implements IWidget {
  protected _children: Set<IWidget>;

  constructor (protected _parent: Parent) {
    this._children = new Set();
    this._parent?.addChild(this);
  }

  addChild (child: IWidget): void {
    this._children.add(child);
  }

  removeChild (child: IWidget): void {
    this._children.delete(child);
  }

  requestUpdate (): void {
    this._parent?.requestUpdate();
  }

  update (dt: number): void {
    for (const child of this._children)
      child.update(dt);
  }
}
