# le5le-abservable

le5le-abserver - A abservable data for JavaScript apps.

# Getting started

## Store [global]

```
import { Store } from 'le5le-abservable';

Store.set('name', 'topology');
Store.get('name');

// 实时监听变化
const subcribe = Store.subcribe('name', value => {
  console.log('name:', value);
});
// 取消订阅（监听）
subcribe.unsubcribe();


Store.set('obj', { str: 'abc', num: 1, arr: ['aaa', 111], children: { key: 123 } });
Store.get('obj.num'); // == 1

Store.get('obj').num = 100;
```

## new Store

```
import { Store } from 'le5le-abservable';


const store = new Store();
store.set('name', 'topology');
store.get('name');

// 实时监听变化
const subcribe = store.subcribe('name', value => {
  console.log('name:', value);
});
// 取消订阅（监听）
subcribe.unsubcribe();


store.set('obj', { str: 'abc', num: 1, arr: ['aaa', 111], children: { key: 123 } });
store.get('obj.num'); // == 1

store.get('obj').num = 100;
```

# License

MIT © le5le.com
