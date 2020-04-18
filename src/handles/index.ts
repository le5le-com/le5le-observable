import { baseHandlers } from "./base";
import { collectionHandlers } from "./collections";


export const handlers = new Map([
  [Map as any, collectionHandlers],
  [Set, collectionHandlers],
  [WeakMap, collectionHandlers],
  [WeakSet, collectionHandlers],
  [Object, baseHandlers],
  [Array, baseHandlers],
  [Int8Array, baseHandlers],
  [Uint8Array, baseHandlers],
  [Uint8ClampedArray, baseHandlers],
  [Int16Array, baseHandlers],
  [Uint16Array, baseHandlers],
  [Int32Array, baseHandlers],
  [Uint32Array, baseHandlers],
  [Float32Array, baseHandlers],
  [Float64Array, baseHandlers],
]);

export function getHandlers(obj: any) {
  return handlers.get(obj.constructor);
}
