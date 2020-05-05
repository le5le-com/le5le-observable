
import { data, observers } from './data';
import { Observer } from './observer';
import { s8 } from './uuid';

export class Store {
  key = s8();

  get(key?: string) {
    return Store.get(this.key + '.' + key);
  }

  set(key: string, value: any) {
    Store.set(this.key + '.' + key, value);
  }

  subscribe(key: string, didUpdate?: (value: any, oldVal: any) => void, beforeUpdate?: (value: any, oldVal: any) => boolean) {
    return Store.subscribe(this.key + '.' + key, didUpdate, beforeUpdate);
  }

  static get(key?: string) {
    if (key === undefined) {
      return data;
    }

    let _data = data;
    const props = key.split('.');
    for (const prop of props) {
      _data = _data[prop];
      if (!_data) {
        break;
      }
    }

    return _data;
  }

  static set(key: string, value: any) {
    const props = key.split('.');
    let val = data;
    for (let i = 0; i < props.length - 1; ++i) {
      if (!val[props[i]]) {
        val[props[i]] = {};
      }
      val = val[props[i]];
    }
    val[props[props.length - 1]] = value;
  }

  static subscribe(key: string, didUpdate?: (value: any, oldVal: any) => void, beforeUpdate?: (value: any, oldVal: any) => boolean) {

    const observer = new Observer(key, didUpdate, beforeUpdate);
    observers.add(observer);

    const value = Store.get(key);
    if (value !== undefined) {
      didUpdate(value, value);
    }

    return observer;
  }
}
