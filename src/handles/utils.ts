import { rawToObservable, parentKey, rawParent } from "../cache";
import { Observable } from "../observable";
import { observers } from "../data";
import { Observer } from "../observer";

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


export function getKeyPath(key: any, target: object) {
  let parent = rawParent.get(target);
  while (parent) {
    key = parentKey.get(parent) + '.' + key;
    parent = rawParent.get(parent);
  }

  return key;
}

export function beforeUpdate(value: any, oldVal: any, keyPath: any) {
  let canUpdate = true;
  observers.forEach((observer: Observer) => {
    if (canUpdate && observer.willUpdate && keyPath.indexOf(observer.key) === 0) {
      canUpdate = observer.willUpdate(value, oldVal);
    }
  });

  return canUpdate;
}

export function afterUpdate(value: any, oldVal: any, keyPath: any) {
  observers.forEach((observer: Observer) => {
    if (observer.didUpdate && keyPath.indexOf(observer.key) === 0) {
      observer.didUpdate(value, oldVal);
    }
  });
}
