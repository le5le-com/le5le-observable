import { rawToObservable } from "../cache";
import { findObservable, wellKnownSymbols } from "./utils";
import { beforeUpdate, afterUpdate, getKeyPath } from "../observer";

export const baseHandlers = {
  get(target: object, key?: string | number | symbol, receiver?: object) {
    const result = Reflect.get(target, key, receiver);
    if (typeof key === 'symbol' && wellKnownSymbols.has(key)) {
      return result;
    }
    return findObservable(result, key, target);
  },
  has(target: object, key: string | number | symbol) {
    return Reflect.has(target, key);
  },
  ownKeys(target: object) {
    return Reflect.ownKeys(target);
  },
  set(target: object, key: string | number | symbol, value: any, receiver: object) {
    if (value && typeof value === 'object') {
      value = rawToObservable.get(value) || value;
    }

    const oldVal = target[key];
    let result = true;
    if (value !== oldVal) {
      const keyPath = getKeyPath(key, target);
      if (beforeUpdate(value, oldVal, keyPath)) {
        result = Reflect.set(target, key, value, receiver);
        afterUpdate(value, oldVal, keyPath);
      }
    }

    return result;
  },
  deleteProperty(target: object, key: string | number | symbol) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const oldVal = target[key];
      const keyPath = getKeyPath(key, target);
      if (beforeUpdate(undefined, oldVal, keyPath)) {
        const result = Reflect.deleteProperty(target, key);
        afterUpdate(undefined, oldVal, keyPath);

        return result;
      }
    }
    return true;
  }
};
