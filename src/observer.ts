import { observers } from './data';

export class Observer {
  key = '';
  didUpdate: (value: any, oldVal: any) => void;
  willUpdate: (value: any, oldVal: any) => boolean;
  constructor(key: string, didUpdate?: (value: any, oldVal: any) => void, willUpdate?: (value: any, oldVal: any) => boolean) {
    this.key = key;
    this.didUpdate = didUpdate;
    this.willUpdate = willUpdate;
  }

  unsubscribe() {
    observers.delete(this);
  }
}

