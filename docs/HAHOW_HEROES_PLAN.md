# Hahow Heroes 前端小專案 - 執行計劃

## Context

Hahow 前端工程師招募 take-home assignment。建立 Hero 能力值管理應用，展示程式設計、程式碼品質、文件撰寫與溝通能力。**獨立 repo**，非 SARA 專案。

---

## 1. Tech Stack（已確定）

| 類別 | 選擇 | 理由 |
|------|------|------|
| Framework | React 19 + TypeScript strict | 最新穩定版，展示對新特性的掌握 |
| Build | Vite 6 + SWC | 極快 HMR、production build |
| Routing | **TanStack Router** (file-based) | Type-safe routing、自動 code splitting、search params validation |
| Server State | **TanStack Query v5** | Cache、dedup、stale-while-revalidate、request cancellation |
| Client State | **Zustand** | 若需跨元件共享 UI state（如 toast 狀態） |
| HTTP | **Axios** | Interceptors、request/response 轉換、cancel token |
| UI | **shadcn/ui** (Radix UI + CVA) | Accessible、可客製、Tailwind 原生整合 |
| Styling | **Tailwind CSS v4** | Utility-first、與 shadcn 完美搭配 |
| Icons | **Lucide React** | 與 shadcn 標配、tree-shakeable |
| Toast | **Sonner** | 輕量、美觀、shadcn 整合 |
| Date | **date-fns** | Tree-shakeable、不可變 |
| Error Monitor | **Sentry** | Production error tracking |
| Testing | **Vitest + MSW** | Vite 原生整合、API mock |
| Lint/Format | **ESLint + Prettier + Biome** | 多層檢查 |

> **能力值編輯器採用純 custom hook**，不使用 TanStack Form。理由：+/- 按鈕操作不是典型表單場景，純 hook 更直覺、更少抽象。

---

## 2. 專案結構（File-based Routing）

```
supplier-link-frontend/
├── public/
│   └── mockServiceWorker.js        # MSW worker
├── src/
│   ├── api/                         # API 層
│   │   ├── client.ts                # Axios instance (base URL, interceptors)
│   │   ├── heroes.ts                # Hero API 函式
│   │   └── types.ts                 # API DTOs
│   ├── components/
│   │   └── ui/                      # shadcn/ui 元件 (已存在)
│   ├── features/heroes/
│   │   ├── components/
│   │   │   ├── hero-card.tsx         # 英雄卡片
│   │   │   ├── hero-list.tsx         # 英雄列表 (flex wrap 置中)
│   │   │   ├── hero-profile.tsx      # 能力值面板
│   │   │   └── ability-row.tsx       # 單一能力值 +/- 控制列
│   │   └── hooks/
│   │       ├── use-heroes.ts         # useQuery: GET /heroes
│   │       ├── use-hero-profile.ts   # useQuery: GET /heroes/:id/profile
│   │       ├── use-save-profile.ts   # useMutation: PATCH /heroes/:id/profile
│   │       └── use-ability-editor.ts # 能力值編輯邏輯 (核心 business logic)
│   ├── lib/
│   │   └── utils.ts                 # cn() helper (shadcn 標配)
│   ├── routes/                      # TanStack Router file-based routes
│   │   ├── __root.tsx               # Root layout (providers, error boundary)
│   │   ├── index.tsx                # "/" → redirect to /heroes
│   │   └── heroes/
│   │       ├── route.tsx            # /heroes layout (包含 HeroList + Outlet)
│   │       ├── index.tsx            # /heroes (只有列表，無 profile)
│   │       └── $heroId.tsx          # /heroes/:heroId (HeroProfile)
│   ├── routeTree.gen.ts             # TanStack Router 自動生成
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                    # Tailwind directives + global styles
├── biome.json
├── eslint.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 3. 核心架構設計

### 3.1 路由結構（TanStack Router File-based）

**關鍵：`heroes/route.tsx` 作為 Layout Route**

```
/                    → redirect to /heroes
/heroes              → heroes/route.tsx (layout) + heroes/index.tsx (empty content)
/heroes/:heroId      → heroes/route.tsx (layout) + heroes/$heroId.tsx (profile)
```

`heroes/route.tsx` 渲染 `<HeroList />` + `<Outlet />`，確保切換英雄時 HeroList 不 unmount/remount。

```typescript
// src/routes/heroes/route.tsx
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

```typescript
// src/routes/heroes/$heroId.tsx
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

**為什麼 TanStack Router 特別適合：**
- `Route.useParams()` 提供 type-safe 的 `heroId`，不需要手動 type assertion
- File-based routing 自動生成 route tree，不會有路由配置錯誤
- Layout route (`route.tsx`) 機制原生支援持久化 parent component

### 3.2 能力值編輯器（`use-ability-editor.ts`）— 純 Custom Hook

核心 business logic，抽為獨立 hook 確保可測試性：

```typescript
function useAbilityEditor(initialProfile: HeroProfile | undefined) {
  const [abilities, setAbilities] = useState<HeroProfile>(/* ... */);

  const totalPoints = useMemo(() => sum(Object.values(initialProfile)), [initialProfile]);
  const currentTotal = useMemo(() => sum(Object.values(abilities)), [abilities]);
  const remaining = totalPoints - currentTotal;

  const increment = (key: keyof HeroProfile) => { /* remaining > 0 guard */ };
  const decrement = (key: keyof HeroProfile) => { /* abilities[key] > 0 guard */ };
  const canSave = remaining === 0 && isDirty;

  // 切換英雄時重置
  useEffect(() => { setAbilities(initialProfile); }, [initialProfile]);

  return { abilities, remaining, increment, decrement, canSave };
}
```

**約束條件：**
- `totalPoints` = 初始能力值總和（不可變）
- `remaining` = totalPoints - currentTotal（必須分配完畢才能儲存）
- `increment`: remaining > 0 時才能增加
- `decrement`: abilities[key] > 0 時才能減少
- `canSave`: remaining === 0 && isDirty

### 3.3 API 層

```typescript
// src/api/client.ts
const apiClient = axios.create({
  baseURL: "https://hahow-recruit.herokuapp.com",
  timeout: 15000, // Heroku cold start 可能很慢
});

// src/api/heroes.ts
export const fetchHeroes = (signal?: AbortSignal) =>
  apiClient.get<Hero[]>("/heroes", { signal }).then(r => r.data);

export const fetchHeroProfile = (heroId: string, signal?: AbortSignal) =>
  apiClient.get<HeroProfile>(`/heroes/${heroId}/profile`, { signal }).then(r => r.data);

export const patchHeroProfile = (heroId: string, profile: HeroProfile) =>
  apiClient.patch<HeroProfile>(`/heroes/${heroId}/profile`, profile).then(r => r.data);
```

### 3.4 TanStack Query Hooks

```typescript
// use-heroes.ts
export const useHeroes = () =>
  useQuery({
    queryKey: ["heroes"],
    queryFn: ({ signal }) => fetchHeroes(signal),
    staleTime: 5 * 60 * 1000,
  });

// use-hero-profile.ts
export const useHeroProfile = (heroId: string) =>
  useQuery({
    queryKey: ["heroes", heroId, "profile"],
    queryFn: ({ signal }) => fetchHeroProfile(heroId, signal),
    enabled: !!heroId,
  });

// use-save-profile.ts
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

### 3.5 HeroCard 優化

```typescript
// React.memo 確保只有 selected 狀態改變的卡片 re-render
const HeroCard = memo(({ hero, isSelected }: Props) => {
  return (
    <Link
      to="/heroes/$heroId"
      params={{ heroId: hero.id }}
      className={cn(
        "rounded-lg border-2 p-4 transition-colors",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-transparent hover:border-muted"
      )}
    >
      <img src={hero.image} alt={hero.name} className="w-full rounded" />
      <p className="mt-2 text-center font-medium">{hero.name}</p>
    </Link>
  );
});
```

---

## 4. 潛在問題與解決方案

| 問題 | 解決方案 |
|------|---------|
| Heroku cold start (10-30s) | axios timeout: 15s、TanStack Query retry: 2 + exponential backoff、Skeleton UI |
| 快速切換英雄 race condition | TanStack Query queryKey 機制 + AbortSignal 自動取消前一個 request |
| 能力值 = 0 按減少 | 按鈕 disabled + guard clause |
| remaining = 0 按增加 | 按鈕 disabled + guard clause |
| remaining != 0 時儲存 | Save 按鈕 disabled + 提示「請分配所有點數」 |
| PATCH 失敗 | 保留 local state、sonner toast 錯誤提示、允許重試 |
| 切換英雄時未儲存的編輯 | 可選：離開前 confirm dialog（用 Radix AlertDialog） |

---

## 5. 加分項目

- **Loading UX**: shadcn Skeleton 元件做 hero card placeholder
- **Error Handling**: Error boundary + retry、API error toast via sonner
- **Accessibility**: Radix UI 原生提供 a11y；aria-live on remaining points；keyboard nav
- **Dark Mode**: next-themes + shadcn dark mode support（已在依賴中）
- **Testing**: useAbilityEditor unit test、MSW integration test
- **Performance**: React.memo on HeroCard、TanStack Query staleTime cache
- **UX**: 未儲存變更離開提醒、Save 成功 toast、+/- 按鈕 long-press 連續觸發
- **Bundle Analysis**: vite-bundle-visualizer（已在 scripts 中）

---

## 6. 實作順序

| 階段 | 任務 | 關鍵檔案 |
|------|------|---------|
| 1 | API 層：axios client + heroes API + types | `src/api/client.ts`, `heroes.ts`, `types.ts` |
| 2 | 路由結構：root layout, heroes layout, redirect | `src/routes/__root.tsx`, `heroes/route.tsx`, `heroes/$heroId.tsx` |
| 3 | HeroList + HeroCard：列表渲染、flex wrap、selected 標示 | `src/features/heroes/components/hero-list.tsx`, `hero-card.tsx` |
| 4 | TanStack Query hooks | `src/features/heroes/hooks/use-heroes.ts`, `use-hero-profile.ts` |
| 5 | useAbilityEditor：核心 business logic | `src/features/heroes/hooks/use-ability-editor.ts` |
| 6 | HeroProfile + AbilityRow：能力值 UI + Save | `hero-profile.tsx`, `ability-row.tsx`, `use-save-profile.ts` |
| 7 | Loading/Error states：Skeleton、toast、error boundary | 各元件內 |
| 8 | Polish：dark mode、a11y、transitions | 全域 |
| 9 | Testing：unit + integration | `__tests__/` 或 co-located |
| 10 | README 撰寫 | `README.md` |

---

## 7. README 結構

1. **Quick Start** — prerequisites、install、dev、test、build
2. **Architecture** — folder structure diagram、tech stack 選型理由、component architecture
3. **Design Decisions** — 為何選 TanStack Router、shadcn/ui、useAbilityEditor 純 hook 而非 TanStack Form
4. **Third-party Libraries** — 每個依賴的理解與使用理由
5. **Comment Principles** — WHY not WHAT、JSDoc for public hooks、邊界案例標註
6. **Difficulties & Solutions** — Heroku latency、re-render prevention、ability point constraints
7. **Bonus Features** — dark mode、a11y、testing、UX enhancements
8. **AI Tool Usage** — 使用工具、情境、互動方式

---

## 8. Verification 驗證方式

1. `pnpm dev` → `/` redirect 到 `/heroes`
2. Hero List 正確載入、水平置中、flex wrap 響應式
3. 點擊 Hero Card → `/heroes/:heroId`，HeroList 不 re-render
4. 選中 Card 有視覺標示（border-primary）
5. Hero Profile 顯示 4 個能力值 + remaining
6. +/- 按鈕邊界條件正確（min 0、remaining 0）
7. remaining = 0 且有變更 → Save 可用；PATCH 成功 → toast + cache 更新
8. 直接輸入 `/heroes/2` URL → 正常運作
9. `pnpm test` 通過
10. `pnpm lint` 無 error
11. `pnpm build` 成功
