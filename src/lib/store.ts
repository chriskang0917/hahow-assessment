import type { StateCreator, StoreApi, UseBoundStore } from "zustand";
import { create as actualCreate } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const storeResetFns = new Set<() => void>();

/**
 * Create a Zustand store with a reset function
 * @param stateCreator - The state creator function
 * @returns The created store
 */
export const create = <T>(stateCreator: StateCreator<T>) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

/**
 * Reset all stores
 */
export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};

/**
 * Create selectors for a store for better performance
 * @param _store - The store to create selectors for
 * @returns The created selectors
 */
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as Record<string, () => unknown>)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};
