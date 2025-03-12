import { DefaultCache } from "../cache";

describe("DefaultCache", () => {
  let cache: DefaultCache;

  beforeEach(() => {
    cache = new DefaultCache();
  });

  test("should return null for non-existent key", () => {
    const result = cache.get({ key: "nonexistent" });
    expect(result).toBeNull();
  });

  test("should store and retrieve a value", () => {
    const context = { key: "test" };
    const value = "test value";

    cache.set(context, value);
    const result = cache.get(context);

    expect(result).toBe(value);
  });

  test("should clear all values", () => {
    const context1 = { key: "test1" };
    const context2 = { key: "test2" };

    cache.set(context1, "value1");
    cache.set(context2, "value2");

    cache.clear();

    expect(cache.get(context1)).toBeNull();
    expect(cache.get(context2)).toBeNull();
  });

  test("should use JSON.stringify for context comparison", () => {
    const context1 = { a: 1, b: 2 };
    const context2 = { b: 2, a: 1 }; // Same content, different order

    cache.set(context1, "test value");
    const result = cache.get(context2);

    expect(result).toBe("test value");
  });
});
