# Hero Features Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Hero ability-point management app with list/profile pages, cleaning up an existing supplier-link template repo.

**Architecture:** TanStack Router layout route keeps HeroList persistent across page transitions. TanStack Query manages server state with automatic cache invalidation. A pure custom hook (`useAbilityEditor`) handles ability-point editing logic with constraint validation.

**Tech Stack:** React 19, TypeScript strict, Vite 6, TanStack Router (file-based), TanStack Query v5, Axios, shadcn/ui, Tailwind CSS v4, Sonner, Zustand, Vitest + MSW

**Spec:** `openspec/changes/hero-features/specs/`
**Design:** `openspec/changes/hero-features/design.md`

---

## Chunk 1: Cleanup & Infrastructure

### Task 1: Remove Unrelated Feature Modules

**Files:**
- Delete: `src/features/auth/` (entire directory)
- Delete: `src/features/root/` (entire directory)
- Delete: `src/routes/_protected.tsx`
- Delete: `src/routes/_protected/` (entire directory)
- Delete: `src/routes/auth.tsx`
- Delete: `src/routes/auth/` (entire directory)
- Delete: `src/hooks/useAuthVerify.ts`
- Delete: `src/components/form/field-info.tsx`
- Delete: `src/components/ui/data-table/` (entire directory)
- Delete: `src/mocks/browser.ts`
- Delete: `src/mocks/mock-config.ts`
- Delete: `src/mocks/proxy-handler.ts`

- [ ] **Step 1: Delete feature directories and MSW browser mocks**

```bash
rm -rf src/features/auth src/features/root
rm -f src/mocks/browser.ts src/mocks/mock-config.ts src/mocks/proxy-handler.ts
```

Note: `src/mocks/browser.ts` imports from `src/features/auth/mocks/auth-handlers` which we're deleting. The MSW browser setup will be rebuilt later if needed.

- [ ] **Step 2: Delete route files and rewrite `src/routes/index.tsx` in same step**

```bash
rm -f src/routes/_protected.tsx src/routes/auth.tsx
rm -rf src/routes/_protected src/routes/auth
```

Also immediately rewrite `src/routes/index.tsx` to remove auth dependency (prevents broken build during route tree regeneration):

```typescript
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/heroes" });
  },
});
```

- [ ] **Step 3: Delete unused hooks and components**

```bash
rm -f src/hooks/useAuthVerify.ts
rm -f src/components/form/field-info.tsx
rm -rf src/components/ui/data-table
```

- [ ] **Step 4: Clean up `src/components/ui/index.ts` — remove data-table exports**

Remove these lines from `src/components/ui/index.ts`:
```typescript
// REMOVE these two lines:
export { default as AutoPagination } from "./data-table/components/auto-pagination";
export { default as DataTable } from "./data-table/components/data-table";
```

- [ ] **Step 5: Verify build passes after cleanup**

```bash
pnpm build
```

Expected: May still fail due to App.tsx auth imports — that's OK, will be fixed in Task 4. But route tree should regenerate without the deleted routes.

- [ ] **Step 6: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove auth, root, supplier modules and unused components"
```

---

### Task 2: Update Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove unused dependencies and add new ones**

```bash
pnpm remove @tanstack/react-form @tanstack/react-table file-saver @base-ui/react
pnpm add sonner
pnpm add -D @testing-library/react
```

Note: `@base-ui/react` is unused since we use shadcn/ui (Radix-based). `@testing-library/react` is needed for hook tests in Task 7.

- [ ] **Step 2: Install `alert-dialog` shadcn component (needed for Task 11)**

```bash
pnpm dlx shadcn@latest add alert-dialog
```

- [ ] **Step 3: Verify install succeeds**

```bash
pnpm install
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/ui/alert-dialog.tsx
git commit -m "chore: remove unused deps, add sonner, testing-library, alert-dialog"
```

---

### Task 3: Simplify Axios Instance

**Files:**
- Modify: `src/lib/axios.ts`

The current `src/lib/axios.ts` has auth-related interceptors (JWT refresh, 401/403 handling) that must be removed. Keep the camelCase↔snake_case transform and error logging.

- [ ] **Step 1: Rewrite `src/lib/axios.ts`**

Replace the entire file with:

```typescript
import axios, { type AxiosResponse } from "axios";
import { camelToSnake, snakeToCamel } from "@/utils/case-transform";

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 15_000,
});

axiosInstance.interceptors.request.use((config) => {
  if (config.data) {
    config.data = camelToSnake(config.data);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    response.data = snakeToCamel(response.data);
    return response;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
```

- [ ] **Step 2: Configure environment and Vite proxy**

Keep the proxy pattern to avoid CORS issues during development. Update `.env.development.example`:

```
VITE_BASE_URL=/api
```

Create `.env.development`:
```
VITE_BASE_URL=/api
```

Create `.env.production`:
```
VITE_BASE_URL=https://hahow-recruit.herokuapp.com
```

Update `vite.config.ts` proxy to point to Hahow API:

```typescript
server: {
  proxy: {
    "/api": {
      target: "https://hahow-recruit.herokuapp.com",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
},
```

This way:
- In dev: `/api/heroes` → proxy → `https://hahow-recruit.herokuapp.com/heroes` (no CORS)
- In production: direct calls to `https://hahow-recruit.herokuapp.com/heroes`

- [ ] **Step 3: Commit**

```bash
git add src/lib/axios.ts .env.development.example .env.production vite.config.ts
git commit -m "refactor: simplify axios instance, configure API proxy for dev"
```

---

### Task 4: Simplify App.tsx and Root Layout

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/routes/__root.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Rewrite `src/App.tsx`**

```typescript
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import queryClient from "@/lib/query-client";
import { routeTree } from "@/routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({ routeTree });

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);

export default App;
```

- [ ] **Step 2: Rewrite `src/routes/__root.tsx`**

```typescript
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}
```

- [ ] **Step 3: Simplify `src/main.tsx` — remove MSW mocking for now**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Note: MSW mocking can be re-enabled later for testing. `src/routes/index.tsx` was already rewritten in Task 1.

- [ ] **Step 4: Verify build passes**

```bash
pnpm build
```

Expected: Build succeeds. There may be lint warnings about unused files — that's OK at this stage.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/routes/__root.tsx src/main.tsx
git commit -m "refactor: simplify App.tsx and root layout, remove auth logic"
```

---

## Chunk 2: API Layer & Query Hooks

### Task 5: Heroes API Types and Service

**Files:**
- Create: `src/features/heroes/services/heroes.dto.ts`
- Create: `src/features/heroes/services/heroes.api.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p src/features/heroes/services
mkdir -p src/features/heroes/components
mkdir -p src/features/heroes/hooks
mkdir -p src/features/heroes/mocks
```

- [ ] **Step 2: Create `src/features/heroes/services/heroes.dto.ts`**

```typescript
import { z } from "zod";

export const heroSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().url(),
});

export const heroProfileSchema = z.object({
  str: z.number().int().min(0),
  int: z.number().int().min(0),
  agi: z.number().int().min(0),
  luk: z.number().int().min(0),
});

export type Hero = z.infer<typeof heroSchema>;
export type HeroProfile = z.infer<typeof heroProfileSchema>;

/** Keys of HeroProfile — used for iterating ability rows */
export type AbilityKey = keyof HeroProfile;

export const ABILITY_KEYS: AbilityKey[] = ["str", "int", "agi", "luk"];

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: "STR",
  int: "INT",
  agi: "AGI",
  luk: "LUK",
};
```

- [ ] **Step 3: Create `src/features/heroes/services/heroes.api.ts`**

```typescript
import axiosInstance from "@/lib/axios";
import { heroProfileSchema, heroSchema, type Hero, type HeroProfile } from "./heroes.dto";

export const fetchHeroes = async (signal?: AbortSignal): Promise<Hero[]> => {
  const { data } = await axiosInstance.get("/heroes", { signal });
  return heroSchema.array().parse(data);
};

export const fetchHeroProfile = async (
  heroId: string,
  signal?: AbortSignal,
): Promise<HeroProfile> => {
  const { data } = await axiosInstance.get(`/heroes/${heroId}/profile`, { signal });
  return heroProfileSchema.parse(data);
};

export const patchHeroProfile = async (
  heroId: string,
  profile: HeroProfile,
): Promise<HeroProfile> => {
  const { data } = await axiosInstance.patch(`/heroes/${heroId}/profile`, profile);
  return heroProfileSchema.parse(data);
};
```

- [ ] **Step 4: Commit**

```bash
git add src/features/heroes/
git commit -m "feat: add heroes API types (Zod) and service functions"
```

---

### Task 6: TanStack Query Hooks

**Files:**
- Create: `src/features/heroes/hooks/use-heroes.ts`
- Create: `src/features/heroes/hooks/use-hero-profile.ts`
- Create: `src/features/heroes/hooks/use-save-profile.ts`

- [ ] **Step 1: Create `src/features/heroes/hooks/use-heroes.ts`**

```typescript
import { useQuery } from "@tanstack/react-query";
import { fetchHeroes } from "@/features/heroes/services/heroes.api";

export const useHeroes = () =>
  useQuery({
    queryKey: ["heroes"],
    queryFn: ({ signal }) => fetchHeroes(signal),
    staleTime: 5 * 60 * 1000,
  });
```

- [ ] **Step 2: Create `src/features/heroes/hooks/use-hero-profile.ts`**

```typescript
import { useQuery } from "@tanstack/react-query";
import { fetchHeroProfile } from "@/features/heroes/services/heroes.api";

export const useHeroProfile = (heroId: string) =>
  useQuery({
    queryKey: ["heroes", heroId, "profile"],
    queryFn: ({ signal }) => fetchHeroProfile(heroId, signal),
    enabled: !!heroId,
  });
```

- [ ] **Step 3: Create `src/features/heroes/hooks/use-save-profile.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patchHeroProfile } from "@/features/heroes/services/heroes.api";
import type { HeroProfile } from "@/features/heroes/services/heroes.dto";

export const useSaveProfile = (heroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: HeroProfile) => patchHeroProfile(heroId, profile),
    onSuccess: (data) => {
      queryClient.setQueryData(["heroes", heroId, "profile"], data);
      toast.success("能力值更新成功");
    },
    onError: () => {
      toast.error("儲存失敗，請重試");
    },
  });
};
```

- [ ] **Step 4: Commit**

```bash
git add src/features/heroes/hooks/
git commit -m "feat: add TanStack Query hooks for heroes API"
```

---

## Chunk 3: Ability Editor (TDD)

### Task 7: useAbilityEditor Hook — Tests First

**Files:**
- Create: `src/features/heroes/hooks/use-ability-editor.ts`
- Create: `src/features/heroes/hooks/use-ability-editor.test.ts`

This is the core business logic hook. We write tests first.

- [ ] **Step 1: Write failing tests in `src/features/heroes/hooks/use-ability-editor.test.ts`**

```typescript
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { HeroProfile } from "@/features/heroes/services/heroes.dto";
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
    // First decrement to get remaining > 0
    act(() => result.current.decrement("str"));
    expect(result.current.remaining).toBe(1);
    // Then increment agi
    act(() => result.current.increment("agi"));
    expect(result.current.abilities!.agi).toBe(1);
    expect(result.current.remaining).toBe(0);
  });

  it("does not increment when remaining = 0", () => {
    const { result } = renderHook(() => useAbilityEditor(mockProfile));
    act(() => result.current.increment("str"));
    expect(result.current.abilities!.str).toBe(5); // unchanged
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
    expect(result.current.abilities!.str).toBe(0); // unchanged
  });

  it("canSave is true when dirty and remaining = 0", () => {
    const { result } = renderHook(() => useAbilityEditor(mockProfile));
    // Redistribute: -1 str, +1 int
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm vitest run src/features/heroes/hooks/use-ability-editor.test.ts
```

Expected: FAIL — module not found. (`@testing-library/react` was already installed in Task 2.)

- [ ] **Step 3: Implement `src/features/heroes/hooks/use-ability-editor.ts`**

```typescript
import { useEffect, useMemo, useState } from "react";
import type { AbilityKey, HeroProfile } from "@/features/heroes/services/heroes.dto";

export const useAbilityEditor = (initialProfile: HeroProfile | undefined) => {
  const [abilities, setAbilities] = useState<HeroProfile | undefined>(initialProfile);

  const totalPoints = useMemo(() => {
    if (!initialProfile) return 0;
    return Object.values(initialProfile).reduce((sum, v) => sum + v, 0);
  }, [initialProfile]);

  const currentTotal = useMemo(() => {
    if (!abilities) return 0;
    return Object.values(abilities).reduce((sum, v) => sum + v, 0);
  }, [abilities]);

  const remaining = totalPoints - currentTotal;

  const isDirty = useMemo(() => {
    if (!abilities || !initialProfile) return false;
    return (Object.keys(abilities) as AbilityKey[]).some(
      (key) => abilities[key] !== initialProfile[key],
    );
  }, [abilities, initialProfile]);

  const canSave = remaining === 0 && isDirty;

  const increment = (key: AbilityKey) => {
    if (remaining <= 0 || !abilities) return;
    setAbilities((prev) => (prev ? { ...prev, [key]: prev[key] + 1 } : prev));
  };

  const decrement = (key: AbilityKey) => {
    if (!abilities || abilities[key] <= 0) return;
    setAbilities((prev) => (prev ? { ...prev, [key]: prev[key] - 1 } : prev));
  };

  useEffect(() => {
    setAbilities(initialProfile);
  }, [initialProfile]);

  return { abilities, remaining, isDirty, canSave, increment, decrement };
};
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm vitest run src/features/heroes/hooks/use-ability-editor.test.ts
```

Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/heroes/hooks/use-ability-editor.ts src/features/heroes/hooks/use-ability-editor.test.ts
git commit -m "feat: add useAbilityEditor hook with full test coverage (TDD)"
```

---

## Chunk 4: Routes & Hero List Components

### Task 8: Route Structure

**Files:**
- Create: `src/routes/heroes/route.tsx`
- Create: `src/routes/heroes/index.tsx`
- Create: `src/routes/heroes/$heroId.tsx`

- [ ] **Step 1: Create route directory**

```bash
mkdir -p src/routes/heroes
```

- [ ] **Step 2: Create `src/routes/heroes/route.tsx` — Layout Route**

This is the key architectural piece. HeroList lives here and persists across hero switches.

```typescript
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HeroList } from "@/features/heroes/components/hero-list";

export const Route = createFileRoute("/heroes")({
  component: HeroesLayout,
});

function HeroesLayout() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <HeroList />
      <Outlet />
    </main>
  );
}
```

- [ ] **Step 3: Create `src/routes/heroes/index.tsx`**

```typescript
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/heroes/")({
  component: HeroesIndexPage,
});

function HeroesIndexPage() {
  return (
    <p className="mt-8 text-center text-muted-foreground">
      請選擇一位英雄查看能力值
    </p>
  );
}
```

- [ ] **Step 4: Create `src/routes/heroes/$heroId.tsx`**

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { HeroProfile } from "@/features/heroes/components/hero-profile";

export const Route = createFileRoute("/heroes/$heroId")({
  component: HeroProfilePage,
});

function HeroProfilePage() {
  const { heroId } = Route.useParams();
  return <HeroProfile heroId={heroId} />;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/routes/heroes/
git commit -m "feat: add heroes route structure with layout route"
```

---

### Task 9: HeroCard and HeroList Components

**Files:**
- Create: `src/features/heroes/components/hero-card.tsx`
- Create: `src/features/heroes/components/hero-card-skeleton.tsx`
- Create: `src/features/heroes/components/hero-list.tsx`

- [ ] **Step 1: Create `src/features/heroes/components/hero-card.tsx`**

```typescript
import { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { Hero } from "@/features/heroes/services/heroes.dto";

type HeroCardProps = {
  hero: Hero;
  isSelected: boolean;
};

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' fill='%23ccc'%3E%3Crect width='150' height='150'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export const HeroCard = memo(({ hero, isSelected }: HeroCardProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to="/heroes/$heroId"
      params={{ heroId: hero.id }}
      className={cn(
        "flex w-36 flex-col items-center rounded-xl border-2 p-4 transition-colors hover:border-primary/50",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-transparent",
      )}
    >
      <img
        src={imgError ? FALLBACK_IMAGE : hero.image}
        alt={hero.name}
        className="aspect-square w-full rounded-lg object-cover"
        loading="lazy"
        onError={() => setImgError(true)}
      />
      <p className="mt-2 text-center font-medium">{hero.name}</p>
    </Link>
  );
});

HeroCard.displayName = "HeroCard";
```

- [ ] **Step 2: Create `src/features/heroes/components/hero-card-skeleton.tsx`**

```typescript
export const HeroCardSkeleton = () => (
  <div className="flex w-36 flex-col items-center rounded-xl border-2 border-transparent p-4">
    <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
    <div className="mt-2 h-5 w-16 animate-pulse rounded bg-muted" />
  </div>
);
```

- [ ] **Step 3: Create `src/features/heroes/components/hero-list.tsx`**

```typescript
import { useParams } from "@tanstack/react-router";
import { useHeroes } from "@/features/heroes/hooks/use-heroes";
import { HeroCard } from "./hero-card";
import { HeroCardSkeleton } from "./hero-card-skeleton";
import { Button } from "@/components/ui/button";

export const HeroList = () => {
  const { heroId } = useParams({ strict: false });
  const { data: heroes, isLoading, isError, refetch } = useHeroes();

  if (isLoading) {
    return (
      <section className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <HeroCardSkeleton key={i} />
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col items-center gap-4 py-8">
        <p className="text-destructive">無法載入英雄列表</p>
        <Button variant="outline" onClick={() => refetch()}>
          重試
        </Button>
      </section>
    );
  }

  if (!heroes || heroes.length === 0) {
    return (
      <section className="py-8 text-center text-muted-foreground">
        目前沒有英雄資料
      </section>
    );
  }

  return (
    <section className="flex flex-wrap justify-center gap-4">
      {heroes.map((hero) => (
        <HeroCard
          key={hero.id}
          hero={hero}
          isSelected={hero.id === heroId}
        />
      ))}
    </section>
  );
};
```

- [ ] **Step 4: Verify build passes**

```bash
pnpm build
```

Expected: Build succeeds (routes auto-generate via TanStack Router plugin).

- [ ] **Step 5: Commit**

```bash
git add src/features/heroes/components/hero-card.tsx src/features/heroes/components/hero-card-skeleton.tsx src/features/heroes/components/hero-list.tsx
git commit -m "feat: add HeroCard, HeroCardSkeleton, and HeroList components"
```

---

## Chunk 5: Hero Profile Components

### Task 10: AbilityRow and HeroProfile Components

**Files:**
- Create: `src/features/heroes/components/ability-row.tsx`
- Create: `src/features/heroes/components/hero-profile.tsx`
- Create: `src/features/heroes/components/hero-profile-skeleton.tsx`

- [ ] **Step 1: Create `src/features/heroes/components/ability-row.tsx`**

```typescript
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AbilityKey } from "@/features/heroes/services/heroes.dto";
import { ABILITY_LABELS } from "@/features/heroes/services/heroes.dto";

type AbilityRowProps = {
  abilityKey: AbilityKey;
  value: number;
  canIncrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const AbilityRow = ({
  abilityKey,
  value,
  canIncrement,
  onIncrement,
  onDecrement,
}: AbilityRowProps) => (
  <div className="flex items-center gap-3">
    <span className="w-12 font-mono font-semibold">{ABILITY_LABELS[abilityKey]}</span>
    <Button
      variant="outline"
      size="icon"
      onClick={onIncrement}
      disabled={!canIncrement}
      aria-label={`增加 ${ABILITY_LABELS[abilityKey]}`}
    >
      <Plus className="h-4 w-4" />
    </Button>
    <span className="w-8 text-center font-mono text-lg">{value}</span>
    <Button
      variant="outline"
      size="icon"
      onClick={onDecrement}
      disabled={value <= 0}
      aria-label={`減少 ${ABILITY_LABELS[abilityKey]}`}
    >
      <Minus className="h-4 w-4" />
    </Button>
  </div>
);
```

- [ ] **Step 2: Create `src/features/heroes/components/hero-profile-skeleton.tsx`**

```typescript
export const HeroProfileSkeleton = () => (
  <div className="mt-8 space-y-6 rounded-xl border p-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="h-5 w-12 animate-pulse rounded bg-muted" />
        <div className="h-9 w-9 animate-pulse rounded bg-muted" />
        <div className="h-6 w-8 animate-pulse rounded bg-muted" />
        <div className="h-9 w-9 animate-pulse rounded bg-muted" />
      </div>
    ))}
    <div className="flex items-center justify-between pt-4">
      <div className="h-5 w-24 animate-pulse rounded bg-muted" />
      <div className="h-10 w-20 animate-pulse rounded bg-muted" />
    </div>
  </div>
);
```

- [ ] **Step 3: Create `src/features/heroes/components/hero-profile.tsx`**

```typescript
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ABILITY_KEYS } from "@/features/heroes/services/heroes.dto";
import { useHeroProfile } from "@/features/heroes/hooks/use-hero-profile";
import { useSaveProfile } from "@/features/heroes/hooks/use-save-profile";
import { useAbilityEditor } from "@/features/heroes/hooks/use-ability-editor";
import { AbilityRow } from "./ability-row";
import { HeroProfileSkeleton } from "./hero-profile-skeleton";

type HeroProfileProps = {
  heroId: string;
};

export const HeroProfile = ({ heroId }: HeroProfileProps) => {
  const { data: profile, isLoading, isError } = useHeroProfile(heroId);
  const { abilities, remaining, canSave, isDirty, increment, decrement } =
    useAbilityEditor(profile);
  const { mutate: save, isPending: isSaving } = useSaveProfile(heroId);

  if (isLoading) return <HeroProfileSkeleton />;

  if (isError) {
    return (
      <div className="mt-8 rounded-xl border border-destructive/50 p-6 text-center text-destructive">
        找不到此英雄的能力值資料
      </div>
    );
  }

  if (!abilities) return null;

  const handleSave = () => {
    if (canSave) save(abilities);
  };

  return (
    <section className="mt-8 rounded-xl border p-6">
      <div className="space-y-4">
        {ABILITY_KEYS.map((key) => (
          <AbilityRow
            key={key}
            abilityKey={key}
            value={abilities[key]}
            canIncrement={remaining > 0}
            onIncrement={() => increment(key)}
            onDecrement={() => decrement(key)}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          剩餘點數: <span className="font-mono font-semibold text-foreground">{remaining}</span>
        </p>
        <Button onClick={handleSave} disabled={!canSave || isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          儲存
        </Button>
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Verify build passes**

```bash
pnpm build
```

- [ ] **Step 5: Manual smoke test**

```bash
pnpm dev
```

Open browser to `http://localhost:5173`. Verify:
1. `/` redirects to `/heroes`
2. Hero list loads with cards
3. Clicking a card shows profile with ability values
4. +/- buttons work, remaining updates
5. Save button enables when `remaining = 0` and values changed

- [ ] **Step 6: Commit**

```bash
git add src/features/heroes/components/
git commit -m "feat: add HeroProfile, AbilityRow, and skeleton components"
```

---

## Chunk 6: Unsaved Changes, Dark Mode, Error Boundary

### Task 11: Unsaved Changes Warning

**Files:**
- Modify: `src/features/heroes/components/hero-profile.tsx`
- Create: `src/features/heroes/components/unsaved-changes-blocker.tsx`

- [ ] **Step 1: Create `src/features/heroes/components/unsaved-changes-blocker.tsx`**

This uses TanStack Router's `useBlocker` and native `beforeunload`.

```typescript
import { useEffect } from "react";
import { useBlocker } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type UnsavedChangesBlockerProps = {
  isDirty: boolean;
};

export const UnsavedChangesBlocker = ({ isDirty }: UnsavedChangesBlockerProps) => {
  const { proceed, reset, status } = useBlocker({
    condition: isDirty,
  });

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return (
    <AlertDialog open={status === "blocked"}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>尚未儲存的修改</AlertDialogTitle>
          <AlertDialogDescription>
            你有尚未儲存的能力值修改，確定要離開嗎？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={reset}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={proceed}>離開</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
```

Note: `alert-dialog` shadcn component was already installed in Task 2.

- [ ] **Step 2: Add `UnsavedChangesBlocker` to `hero-profile.tsx`**

Add import at top:
```typescript
import { UnsavedChangesBlocker } from "./unsaved-changes-blocker";
```

Add inside the `<section>` return, before the closing tag:
```typescript
<UnsavedChangesBlocker isDirty={isDirty} />
```

- [ ] **Step 3: Verify functionality**

```bash
pnpm dev
```

Test: modify ability values, click a different hero → AlertDialog should appear.

- [ ] **Step 4: Commit**

```bash
git add src/features/heroes/components/unsaved-changes-blocker.tsx src/features/heroes/components/hero-profile.tsx
git commit -m "feat: add unsaved changes warning with useBlocker and beforeunload"
```

---

### Task 12: Dark Mode Toggle

**Files:**
- Create: `src/features/heroes/components/dark-mode-toggle.tsx`
- Modify: `src/routes/heroes/route.tsx`

- [ ] **Step 1: Create `src/features/heroes/components/dark-mode-toggle.tsx`**

Uses a simple hook with localStorage + `prefers-color-scheme`. No extra dependencies needed.

```typescript
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const DarkModeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label="切換主題">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};
```

- [ ] **Step 2: Add toggle to `src/routes/heroes/route.tsx`**

Update the layout to include the dark mode toggle in the top-right corner:

```typescript
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HeroList } from "@/features/heroes/components/hero-list";
import { DarkModeToggle } from "@/features/heroes/components/dark-mode-toggle";

export const Route = createFileRoute("/heroes")({
  component: HeroesLayout,
});

function HeroesLayout() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hahow Heroes</h1>
        <DarkModeToggle />
      </div>
      <HeroList />
      <Outlet />
    </main>
  );
}
```

- [ ] **Step 3: Add dark mode initialization script to `index.html`**

Add this inline script to `<head>` in `index.html` to prevent flash of wrong theme:

```html
<script>
  (function() {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

- [ ] **Step 4: Verify dark mode works**

```bash
pnpm dev
```

Test: click toggle, verify theme switches. Refresh page — theme should persist.

- [ ] **Step 5: Commit**

```bash
git add src/features/heroes/components/dark-mode-toggle.tsx src/routes/heroes/route.tsx index.html
git commit -m "feat: add dark mode toggle with localStorage persistence"
```

---

### Task 13: Error Boundaries

**Files:**
- Modify: `src/routes/heroes/route.tsx` (add errorComponent)
- Modify: `src/routes/heroes/$heroId.tsx` (add errorComponent)

TanStack Router has built-in error boundary support via `errorComponent` on each route.

- [ ] **Step 1: Add error component to `src/routes/heroes/route.tsx`**

Add to the route config:

```typescript
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HeroList } from "@/features/heroes/components/hero-list";
import { DarkModeToggle } from "@/features/heroes/components/dark-mode-toggle";

export const Route = createFileRoute("/heroes")({
  component: HeroesLayout,
  errorComponent: HeroesError,
});

function HeroesLayout() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hahow Heroes</h1>
        <DarkModeToggle />
      </div>
      <HeroList />
      <Outlet />
    </main>
  );
}

function HeroesError() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-lg text-destructive">頁面發生錯誤</p>
      <Button onClick={() => router.invalidate()}>重新載入</Button>
    </main>
  );
}
```

- [ ] **Step 2: Add error component to `src/routes/heroes/$heroId.tsx`**

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HeroProfile } from "@/features/heroes/components/hero-profile";

export const Route = createFileRoute("/heroes/$heroId")({
  component: HeroProfilePage,
  errorComponent: HeroProfileError,
});

function HeroProfilePage() {
  const { heroId } = Route.useParams();
  return <HeroProfile heroId={heroId} />;
}

function HeroProfileError() {
  return (
    <div className="mt-8 rounded-xl border border-destructive/50 p-6 text-center">
      <p className="text-destructive">載入英雄資料時發生錯誤</p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/heroes/route.tsx src/routes/heroes/\$heroId.tsx
git commit -m "feat: add error boundaries to heroes routes"
```

---

## Chunk 7: Testing, Polish & README

### Task 14: MSW Mock Handlers

**Files:**
- Create: `src/features/heroes/mocks/heroes-handlers.ts`

- [ ] **Step 1: Create `src/features/heroes/mocks/heroes-handlers.ts`**

```typescript
import { http, HttpResponse } from "msw";

const baseURL = "https://hahow-recruit.herokuapp.com";

const mockHeroes = [
  { id: "1", name: "Ditto", image: "https://hahow-recruit.herokuapp.com/images/ditto.png" },
  { id: "2", name: "Pikachu", image: "https://hahow-recruit.herokuapp.com/images/pikachu.png" },
  { id: "3", name: "Charizard", image: "https://hahow-recruit.herokuapp.com/images/charizard.png" },
  { id: "4", name: "Mew", image: "https://hahow-recruit.herokuapp.com/images/mew.png" },
];

const mockProfiles: Record<string, { str: number; int: number; agi: number; luk: number }> = {
  "1": { str: 2, int: 7, agi: 5, luk: 6 },
  "2": { str: 5, int: 5, agi: 5, luk: 5 },
  "3": { str: 8, int: 4, agi: 6, luk: 2 },
  "4": { str: 3, int: 9, agi: 4, luk: 4 },
};

export const heroesHandlers = [
  http.get(`${baseURL}/heroes`, () => HttpResponse.json(mockHeroes)),

  http.get(`${baseURL}/heroes/:heroId/profile`, ({ params }) => {
    const profile = mockProfiles[params.heroId as string];
    if (!profile) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(profile);
  }),

  http.patch(`${baseURL}/heroes/:heroId/profile`, async ({ params, request }) => {
    const body = await request.json();
    mockProfiles[params.heroId as string] = body as typeof mockProfiles["1"];
    return HttpResponse.json(body);
  }),
];
```

- [ ] **Step 2: Commit**

```bash
git add src/features/heroes/mocks/
git commit -m "feat: add MSW mock handlers for heroes API"
```

---

### Task 15: Final Verification

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

Fix any errors. Warnings are acceptable.

- [ ] **Step 2: Run type check**

```bash
pnpm type-check
```

Fix any TypeScript errors.

- [ ] **Step 3: Run tests**

```bash
pnpm test
```

Expected: All tests pass.

- [ ] **Step 4: Run build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 5: Manual verification checklist**

Run `pnpm dev` and verify:
1. `/` redirects to `/heroes` ✓
2. Hero list loads, cards display with images and names ✓
3. Cards are flex-wrap responsive ✓
4. Clicking a card navigates to `/heroes/:heroId` ✓
5. Selected card has `border-primary` + `bg-primary/10` ✓
6. HeroList does NOT re-render on hero switch ✓
7. Hero Profile shows 4 ability rows + remaining + save button ✓
8. +/- buttons work with correct constraints ✓
9. Save button disabled when `remaining != 0` or not dirty ✓
10. Save succeeds with toast notification ✓
11. Unsaved changes → switching hero shows AlertDialog ✓
12. Dark mode toggle works and persists ✓
13. Direct URL `/heroes/2` works on page refresh ✓

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: address lint and verification issues"
```

---

### Task 16: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write README.md**

The README must cover all required sections from the assessment instructions. Write it with these sections:

1. **Quick Start** — prerequisites (Node.js 20+, pnpm), install, dev, test, build commands
2. **Architecture** — folder structure diagram, feature-based module design, component hierarchy
3. **Design Decisions** — why TanStack Router (layout route), pure hook vs TanStack Form, simplified API layer
4. **Third-party Libraries** — each dependency with rationale
5. **Comment Principles** — WHY not WHAT, JSDoc for public hooks, edge case annotations
6. **Difficulties & Solutions** — Heroku latency (skeleton + timeout), re-render prevention (layout route), ability point constraints (useAbilityEditor)
7. **Bonus Features** — dark mode, unsaved changes warning, skeleton loading, error boundary, React.memo optimization, Zod API validation
8. **AI Tool Usage** — Claude Code, brainstorming, code generation, testing

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README for assessment submission"
```
