import { data } from "../src/data";
import { rawParent } from "../src/cache";
import { Store } from "../src/store";

data.aaa = 1;
data.test = { a: 111, obj: { aaa: { bbb: { ccc: 1, c: 'aaa', d: new Map([['e', { f: 'f' }]]), set: new Set() } } } };

const test = { a: { b: { c: 1 } } };
console.time('time on: normal');
test.a.b.c = 2;
console.timeEnd('time on: normal');
console.time('time on: set');
data.test.obj.aaa.bbb.d.get('e').f = 'fff';
console.timeEnd('time on: set');
console.time('time on: get');
const a = data.test.obj.aaa.bbb.d.get('e').f;
console.timeEnd('time on: get');


Store.subscribe('aaa', (val, oldVal) => {
  console.log('subscribe: aaa', val, oldVal);
}, () => {
  return false;
});

Store.subscribe('test.obj', (val, oldVal) => {
  console.log('subscribe: test.obj', val, oldVal);
});

delete data.aaa;
data.test.obj.aaa.bbb.ccc = 'ccc';

data.test.obj.aaa.bbb.d.set('map', 'fff');
data.test.obj.aaa.bbb.set.add('aaaa');

console.log('data:', data, rawParent);


const store = new Store();

store.subscribe('aaaaaaa', (val, oldVal) => {
  console.log('subscribe: store.aaaaaaa', val, oldVal);
});

store.subscribe('arr', (val, oldVal) => {
  console.log('subscribe: store.arr', val, oldVal);
});

store.set('arr', [1, 2, 3, 4]);
store.set('arr.1', 3);
const arr = store.get('arr');
arr[2] = 2222;

store.set('aaaaaaa', { a: { b: { c: 123 } } });
store.set('aaaaaaa.a.b.c', 222);

console.log('store:', store);
