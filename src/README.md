# data

全局存储数据对象

# Store

全局数据存储管理

- set(key, value): void  
  设置 key=value。支持 a.b.c 等子属性方式，如果父对象不存在，自动创建空对象。

- get(key): value  
  获取当前 key 对应的 value 值。

- subscribe(key: string, didUpdate?: (value: any, oldVal: any) => void, beforeUpdate?: (value: any, oldVal: any) => boolean): Observer  
  订阅 key 的值，当 key 对应的 value 发生变化时，调用 didUpdate、beforeUpdate 回调函数。  
  didUpdate - value 更新后的回调函数  
  beforeUpdate - value 更新前的回调函数。如果返回 false，取消更新。  
  返回值 Observer：可观察者对象。

# Observer

观察者

- unsubcribe(): void  
  取消订阅。
