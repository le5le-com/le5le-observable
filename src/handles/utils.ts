import { rawToObservable, parentKey } from "../cache";
import { Observable } from "../observable";

export const wellKnownSymbols = new Set(
  Object.getOwnPropertyNames(Symbol)
    .map(key => Symbol[key])
    .filter(value => typeof value === "symbol"),
);

export function findObservable(obj: any, key?: any, parent?: object) {
  const observable = rawToObservable.get(obj);
  if (obj && typeof obj === 'object') {
    if (observable) {
      return observable;
    } else {
      parentKey.set(parent, key);
      return new Observable(obj, parent);
    }
  }

  return observable || obj;
}

export function patchIterator(iterator: any, isEntries: boolean) {
  const originalNext = iterator.next;
  iterator.next = () => {
    let { done, value } = originalNext.call(iterator);
    if (!done) {
      if (isEntries) {
        value[1] = findObservable(value[1]);
      } else {
        value = findObservable(value);
      }
    }
    return { done, value };
  };
  return iterator;
}

