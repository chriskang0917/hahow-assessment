## 1. 清理既有模組與依賴

- [x] 1.1 移除 `src/features/auth/` 整個目錄
- [x] 1.2 移除 `src/features/root/` 整個目錄
- [x] 1.3 移除 `src/routes/_protected/` 和 `src/routes/_protected.tsx`
- [x] 1.4 移除 `src/routes/auth/` 和 `src/routes/auth.tsx`
- [x] 1.5 移除 `src/hooks/useAuthVerify.ts`
- [x] 1.6 移除 `src/components/form/field-info.tsx` 和 `src/components/ui/data-table/`
- [x] 1.7 從 `package.json` 移除 `@tanstack/react-form`、`@tanstack/react-table`、`file-saver`，新增 `sonner`
- [x] 1.8 執行 `pnpm install` 並確認無錯誤

## 2. 簡化基礎設施

- [x] 2.1 簡化 `src/lib/axios.ts`：移除 auth interceptor，保留 case transform，設定 timeout 15s
- [x] 2.2 簡化 `src/App.tsx`：移除 auth context、route masks，僅保留 QueryClientProvider + RouterProvider
- [x] 2.3 簡化 `src/routes/__root.tsx`：移除 auth 邏輯，加入 Sonner `<Toaster />`
- [x] 2.4 修改 `src/routes/index.tsx`：根路徑 redirect 至 `/heroes`
- [x] 2.5 更新 `.env.development.example`：設定 `VITE_BASE_URL=https://hahow-recruit.herokuapp.com`
- [x] 2.6 確認 `pnpm build` 和 `pnpm lint` 通過

## 3. Heroes API 層

- [x] 3.1 建立 `src/features/heroes/services/heroes.dto.ts`：定義 Hero、HeroProfile 型別 + Zod schema
- [x] 3.2 建立 `src/features/heroes/services/heroes.api.ts`：fetchHeroes、fetchHeroProfile、patchHeroProfile 函式

## 4. 路由結構

- [x] 4.1 建立 `src/routes/heroes/route.tsx`：Layout Route，渲染 HeroList + Outlet
- [x] 4.2 建立 `src/routes/heroes/index.tsx`：`/heroes` 頁面（列表，無 profile）
- [x] 4.3 建立 `src/routes/heroes/$heroId.tsx`：`/heroes/:heroId` 頁面，渲染 HeroProfile

## 5. TanStack Query Hooks

- [x] 5.1 建立 `src/features/heroes/hooks/use-heroes.ts`：useQuery 包裝 fetchHeroes
- [x] 5.2 建立 `src/features/heroes/hooks/use-hero-profile.ts`：useQuery 包裝 fetchHeroProfile
- [x] 5.3 建立 `src/features/heroes/hooks/use-save-profile.ts`：useMutation 包裝 patchHeroProfile + cache 更新 + toast

## 6. Hero List 元件

- [x] 6.1 建立 `src/features/heroes/components/hero-card.tsx`：圖片、名字、Link、selected 標示、React.memo
- [x] 6.2 建立 `src/features/heroes/components/hero-list.tsx`：flex wrap 置中排列、skeleton loading、error/empty state
- [x] 6.3 建立 `src/features/heroes/components/hero-card-skeleton.tsx`：Card loading skeleton

## 7. 能力值編輯器 Hook

- [x] 7.1 建立 `src/features/heroes/hooks/use-ability-editor.ts`：管理 abilities state、remaining、increment/decrement guards、canSave、isDirty
- [x] 7.2 建立 `src/features/heroes/hooks/use-ability-editor.test.ts`：unit test 涵蓋所有邊界條件

## 8. Hero Profile 元件

- [x] 8.1 建立 `src/features/heroes/components/ability-row.tsx`：單一能力值 label + 數值 + +/- 按鈕
- [x] 8.2 建立 `src/features/heroes/components/hero-profile.tsx`：能力值面板 + 剩餘點數 + 儲存按鈕 + loading/error state
- [x] 8.3 建立 `src/features/heroes/components/hero-profile-skeleton.tsx`：Profile loading skeleton

## 9. 未儲存變更提醒

- [x] 9.1 在 hero-profile 中整合 TanStack Router `useBlocker`，搭配 shadcn AlertDialog
- [x] 9.2 加入 `beforeunload` 事件監聽，處理瀏覽器關閉/重新整理

## 10. Dark Mode

- [x] 10.1 建立 dark mode toggle 元件（放在頁面右上角），使用 localStorage 持久化 + prefers-color-scheme 偵測
- [x] 10.2 確認所有元件在 dark mode 下正常顯示

## 11. Error Boundary

- [x] 11.1 在 `heroes/route.tsx` 加入 Error Boundary（保護整個 heroes 區域）
- [x] 11.2 在 `heroes/$heroId.tsx` 加入 Error Boundary（僅保護 profile 區域）

## 12. 測試與驗證

- [x] 12.1 建立 `src/features/heroes/mocks/heroes-handlers.ts`：MSW mock handlers
- [x] 12.2 驗證所有頁面功能：列表載入、Card 點擊、能力值編輯、儲存、URL 直接輸入
- [x] 12.3 執行 `pnpm lint` 和 `pnpm build` 確認無錯誤

## 13. README

- [x] 13.1 撰寫 README.md：Quick Start、架構說明、第三方 library、註解原則、困難與解決、加分項目、AI 工具使用
