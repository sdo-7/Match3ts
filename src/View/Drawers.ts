import type Rect from '../Rect.ts';

const padding = 2;

type Template = (fillStyle: string, c: CanvasRenderingContext2D, rect: Rect, alpha: number) => void;

const templates: Template[] = [];

templates[0] = function (fillStyle: string, c: CanvasRenderingContext2D, rect: Rect, alpha: number = 100) {
  const center = {
    x: rect.x + rect.width/2,
    y: rect.y + rect.height/2
  };
  const radius = Math.min(rect.width, rect.height) / 2 - padding*2;

  c.fillStyle = getFillStyle(fillStyle, alpha);
  c.beginPath();
  c.arc(center.x, center.y, radius, 0, Math.PI*2);
  c.fill();
}

templates[1] = function (fillStyle: string, c: CanvasRenderingContext2D, rect: Rect, alpha: number = 100) {
  c.fillStyle = getFillStyle(fillStyle, alpha);
  c.fillRect(rect.x + padding,
             rect.y + padding,
             rect.width - padding*2,
             rect.height - padding*2);
}

templates[2] = function (fillStyle: string, c: CanvasRenderingContext2D, rect: Rect, alpha: number = 100) {
  const left = rect.x + padding;
  const right = rect.x + rect.width - padding;
  const bottom = rect.y + rect.height - padding;
  const top = rect.y + padding;
  const center = rect.x + rect.width/2;

  c.fillStyle = getFillStyle(fillStyle, alpha);
  c.beginPath();
  c.moveTo(left, bottom);
  c.lineTo(center, top);
  c.lineTo(right, bottom);
  c.lineTo(left, bottom);
  c.fill();
}

function getFillStyle (fillStyle: string, alpha: number) {
  const res = `rgb(${fillStyle} / ${alpha}%)`;
  return res;
}

export type Drawer = (c: CanvasRenderingContext2D, rect: Rect, alpha?: number) => void;

const drawers: Drawer[] = [
  templates[0].bind(null, '213 0 0'),
  templates[0].bind(null, '0 200 83'),
  templates[0].bind(null, '255 214 0'),
  templates[0].bind(null, '98 0 234'),
  templates[0].bind(null, '48 79 254'),
  templates[0].bind(null, '0 184 212'),
];
export default drawers;
