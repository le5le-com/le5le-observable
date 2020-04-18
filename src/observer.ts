import { observers } from './data';
import { rawParent, parentKey } from './cache';

export class Observer {
  key = '';
  updated: (value: any, oldVal: any) => void;
  beforeFn: (value: any, oldVal: any) => boolean;
  constructor(key: string, updated?: (value: any, oldVal: any) => void, beforeFn?: (value: any, oldVal: any) => boolean) {
    this.key = key;
    this.updated = updated;
    this.beforeFn = beforeFn;
  }

  unsubscribe() {
    observers.delete(this);
  }
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
    if (canUpdate && observer.beforeFn && keyPath.indexOf(observer.key) === 0) {
      canUpdate = observer.beforeFn(value, oldVal);
    }
  });

  return canUpdate;
}

export function afterUpdate(value: any, oldVal: any, keyPath: any) {
  observers.forEach((observer: Observer) => {
    if (observer.updated && keyPath.indexOf(observer.key) === 0) {
      observer.updated(value, oldVal);
    }
  });
}
