// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { HeroProfile } from "@/types/hero.type";
import { useAbilityEditor } from "./use-ability-editor";

const mockProfile: HeroProfile = { str: 5, int: 5, agi: 5, luk: 5 };

describe("useAbilityEditor", () => {
  it("initializes with profile values and remaining = 0", () => {
    const { result } = renderHook(() => useAbilityEditor(mockProfile));
    expect(result.current.abilities).toEqual(mockProfile);
    expect(result.current.remaining).toBe(0);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.canSave).toBe(false);
  });

  it("returns undefined abilities when profile is undefined", () => {
    const { result } = renderHook(() => useAbilityEditor(undefined));
    expect(result.current.abilities).toBeUndefined();
  });

  it("increments a value and decreases remaining", () => {
    const { result } = renderHook(() =>
      useAbilityEditor({ str: 5, int: 5, agi: 0, luk: 5 }),
    );
    act(() => result.current.decrement("str"));
    expect(result.current.remaining).toBe(1);
    act(() => result.current.increment("agi"));
    expect(result.current.abilities!.agi).toBe(1);
    expect(result.current.remaining).toBe(0);
  });

  it("does not increment when remaining = 0", () => {
    const { result } = renderHook(() => useAbilityEditor(mockProfile));
    act(() => result.current.increment("str"));
    expect(result.current.abilities!.str).toBe(5);
  });

  it("decrements a value and increases remaining", () => {
    const { result } = renderHook(() => useAbilityEditor(mockProfile));
    act(() => result.current.decrement("str"));
    expect(result.current.abilities!.str).toBe(4);
    expect(result.current.remaining).toBe(1);
  });

  it("does not decrement below 0", () => {
    const { result } = renderHook(() =>
      useAbilityEditor({ str: 0, int: 5, agi: 5, luk: 5 }),
    );
    act(() => result.current.decrement("str"));
    expect(result.current.abilities!.str).toBe(0);
  });

  it("canSave is true when dirty and remaining = 0", () => {
    const { result } = renderHook(() => useAbilityEditor(mockProfile));
    act(() => result.current.decrement("str"));
    act(() => result.current.increment("int"));
    expect(result.current.isDirty).toBe(true);
    expect(result.current.remaining).toBe(0);
    expect(result.current.canSave).toBe(true);
  });

  it("canSave is false when remaining != 0", () => {
    const { result } = renderHook(() => useAbilityEditor(mockProfile));
    act(() => result.current.decrement("str"));
    expect(result.current.remaining).toBe(1);
    expect(result.current.canSave).toBe(false);
  });

  it("resets when initialProfile changes", () => {
    const { result, rerender } = renderHook(
      ({ profile }) => useAbilityEditor(profile),
      { initialProps: { profile: mockProfile } },
    );
    act(() => result.current.decrement("str"));
    expect(result.current.isDirty).toBe(true);

    const newProfile: HeroProfile = { str: 10, int: 10, agi: 10, luk: 10 };
    rerender({ profile: newProfile });
    expect(result.current.abilities).toEqual(newProfile);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.remaining).toBe(0);
  });
});
