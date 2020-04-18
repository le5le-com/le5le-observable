import { observableToRaw, parentKey } from "../cache";
import { findObservable, patchIterator } from "./utils";
import { beforeUpdate, afterUpdate, getKeyPath } from "../observer";


export const instrumentations = {
  has(key: object) {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);
    return proto.has.apply(target, arguments);
  },
  get(key: object) {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);
    return findObservable(proto.get.apply(target, arguments), key, target);
  },
  add(key: object) {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);

    const keyPath = getKeyPath(key, target);
    if (!proto.has.call(target, key)) {
      if (!beforeUpdate(key, undefined, keyPath)) {
        return true;
      }
    }

    const result = proto.add.apply(target, arguments);
    afterUpdate(key, undefined, keyPath);

    return result;
  },
  set(key: object, value: any) {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);
    const oldVal = proto.get.call(target, key);

    let result = true;
    if (value !== oldVal) {
      const keyPath = getKeyPath(key, target);
      if (beforeUpdate(value, oldVal, keyPath)) {
        result = proto.set.apply(target, arguments);
        afterUpdate(value, oldVal, keyPath);
      }
    }

    return result;
  },
  delete(key: object) {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);
    const oldVal = proto.get ? proto.get.call(target, key) : undefined;

    let result = true;
    if (proto.has.call(target, key)) {
      const keyPath = getKeyPath(key, target);
      if (beforeUpdate(undefined, oldVal, keyPath)) {
        result = proto.delete.apply(target, arguments);
        afterUpdate(undefined, oldVal, keyPath);
      }
    }
    return result;
  },
  clear() {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);
    const oldTarget = target instanceof Map ? new Map(target) : new Set(target);
    let result = true;
    if (target.size > 0) {
      // ({ target, oldTarget, type: 'clear' });
      const keyPath = getKeyPath('', target);
      if (beforeUpdate(undefined, oldTarget, keyPath)) {
        result = proto.clear.apply(target, arguments);
        afterUpdate(undefined, oldTarget, keyPath);
      }
    }
    return result;
  },
  forEach(cb: Function, ...args: any[]) {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);
    const wrappedCb = (value: any, ...rest: any[]) => cb(findObservable(value), ...rest);
    return proto.forEach.call(target, wrappedCb, ...args);
  },
  keys() {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);
    return proto.keys.apply(target, arguments);
  },
  values() {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);
    const iterator = proto.values.apply(target, arguments);
    return patchIterator(iterator, false);
  },
  entries() {
    const target = observableToRaw.get(this);
    const proto: any = Reflect.getPrototypeOf(this);
    const iterator = proto.entries.apply(target, arguments);
    return patchIterator(iterator, true);
  },
  [Symbol.iterator]() {
    const target = observableToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    const iterator = proto[Symbol.iterator].apply(target, arguments);
    return patchIterator(iterator, target instanceof Map);
  },
  get size() {
    const target = observableToRaw.get(this);
    const proto = Reflect.getPrototypeOf(this);
    return Reflect.get(proto, 'size', target);
  }
};

// 给Proxy的第二个参数handlers只有get
// 把collection的get、set等api移交给上面劫持函数
export const collectionHandlers = {
  get(target: object, key: string | number | symbol, receiver: object) {
    target = Object.prototype.hasOwnProperty.call(instrumentations, key)
      ? instrumentations
      : target;
    return Reflect.get(target, key, receiver);
  },
};
