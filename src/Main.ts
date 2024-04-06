import type {Value} from './GameElement.ts';
import Model from './Model.js';
import View from './View.js';
import Application from './Application.js';

const application = new Application();

const model = new Model(15, 15, 3, randomValue);
model.init();

const view = new View(application,
                      document.getElementById('gameCanvas') as HTMLCanvasElement);
view.model = model;

application.update(document.timeline.currentTime as number);

function randomValue (): Value {
  const MaxValue = 5;
  let value = MaxValue;
  value += 1;
  value *= Math.random();
  value = Math.floor(value);

  return value as Value;
}
