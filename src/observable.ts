import { observableToRaw, rawToObservable, rawParent } from "./cache";
import { getHandlers } from "./handles";

function proxy(obj: any, parent?: object) {
  const observable = new Proxy(obj, getHandlers(obj));
  observableToRaw.set(observable, obj);
  rawToObservable.set(obj, observable);

  rawParent.set(obj, parent);

  return observable;
}

export class Observable {
  constructor(obj: any = {}, parent?: object) {
    if (observableToRaw.has(obj) || typeof obj === 'function') {
      return obj;
    }
    return rawToObservable.get(obj) || proxy(obj, parent);
  }
}
