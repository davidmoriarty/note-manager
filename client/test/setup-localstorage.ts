// client/test/setup-localstorage.ts
type LocalStorageLike = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem" | "clear"
> & { store: Record<string, string> };

const localStorageShim: LocalStorageLike = {
  store: {},
  getItem(key: string) {
    return this.store[key] ?? null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageShim,
  configurable: true,
});
