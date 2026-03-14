import { describe, expect, it } from "vitest";
import { camelToSnake, snakeToCamel } from "./case-transform";

describe("case-transform", () => {
  it("should convert snake_case to camelCase (nested object)", () => {
    const input = {
      first_key: 1,
      nested_obj: {
        second_key: 2,
        deep_nested: {
          third_key: 3,
        },
      },
      arr: [{ fourth_key: 4 }, 5, "six"],
      primitive: true,
    };
    const expected = {
      firstKey: 1,
      nestedObj: {
        secondKey: 2,
        deepNested: {
          thirdKey: 3,
        },
      },
      arr: [{ fourthKey: 4 }, 5, "six"],
      primitive: true,
    };
    expect(snakeToCamel(input)).toEqual(expected);
  });

  it("should convert camelCase to snake_case (nested object)", () => {
    const input = {
      firstKey: 1,
      nestedObj: {
        secondKey: 2,
        deepNested: {
          thirdKey: 3,
        },
      },
      arr: [{ fourthKey: 4 }, 5, "six"],
      primitive: true,
    };
    const expected = {
      first_key: 1,
      nested_obj: {
        second_key: 2,
        deep_nested: {
          third_key: 3,
        },
      },
      arr: [{ fourth_key: 4 }, 5, "six"],
      primitive: true,
    };
    expect(camelToSnake(input)).toEqual(expected);
  });

  it("should handle primitive types", () => {
    expect(snakeToCamel(123)).toBe(123);
    expect(snakeToCamel("abc")).toBe("abc");
    expect(snakeToCamel(true)).toBe(true);
    expect(camelToSnake(123)).toBe(123);
    expect(camelToSnake("abc")).toBe("abc");
    expect(camelToSnake(false)).toBe(false);
  });

  it("should handle arrays of objects", () => {
    const input = [{ snake_case: 1 }, { another_key: 2 }];
    const expected = [{ snakeCase: 1 }, { anotherKey: 2 }];
    expect(snakeToCamel(input)).toEqual(expected);
    expect(camelToSnake(expected)).toEqual(input);
  });
});
