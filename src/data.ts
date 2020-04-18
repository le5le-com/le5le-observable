import { Observable } from "./observable";

// The global data.
export const data: any = new Observable({});

// The observer of store.
export const observers = new Set<object>();

