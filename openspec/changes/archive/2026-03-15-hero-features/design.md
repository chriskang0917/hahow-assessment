## Context

目前 repo 基於 supplier-link-frontend 模板，包含 auth、factory、supplier 等與 Hahow Heroes 無關的功能模組。需要清理後建立 Hero 功能。

現有基礎設施可直接複用：
- Vite 6 + SWC 建置工具鏈
- TanStack Router（file-based routing）
- TanStack Query v5（server state）
- shadcn/ui + Tailwind CSS v4（UI 元件與樣式）
- `src/lib/axios.ts`（HTTP client，需簡化移除 auth interceptor）
- Biome + ESLint + Prettier（程式碼品質）

外部 API 為 Hahow Heroku 服務，可能有 cold start 延遲（10-30s）。

## Goals / Non-Goals

**Goals:**
- 完整實作 Hero List Page 與 Hero Profile Page 兩個頁面
- 清理所有無關模組，保持 repo 乾淨
- 提供良好的 loading/error UX（skeleton、toast、error boundary）
- 支援 dark mode
- 未儲存變更離開提醒
- 能力值編輯的完整約束驗證
- 響應式設計（flex wrap）

**Non-Goals:**
- 使用者認證/授權（移除）
- 國際化（i18n）
- SSR/SSG
- 能力值的上限驗證（API 無此限制）
- 多人同時編輯衝突處理

## Decisions

### 1. 路由架構：Layout Route 持久化 HeroList

使用 TanStack Router 的 Layout Route 機制，`heroes/route.tsx` 作為 layout 渲染 `<HeroList />` + `<Outlet />`。切換英雄時只有 Outlet 內容替換，HeroList 不 unmount/remount。

**替代方案**：將 HeroList 放在每個頁面元件中 → 切換英雄會 re-render 整個列表，違反需求。

### 2. 能力值編輯：純 Custom Hook（useAbilityEditor）

核心 business logic 抽為獨立 hook，管理 abilities state、remaining 計算、increment/decrement guards、canSave 判斷。

**替代方案**：使用 TanStack Form → 過度抽象，+/- 按鈕操作不是典型表單場景。

### 3. HTTP Client：簡化現有 axios.ts

保留 `src/lib/axios.ts` 的 axios instance 和 camelCase↔snake_case 轉換，移除 auth 相關 interceptor（JWT refresh、401/403 處理）。baseURL 改用 `VITE_BASE_URL` 指向 Hahow API。

**替代方案**：新建 `src/api/client.ts` → 增加不必要的檔案，現有 instance 已有好的轉換邏輯。

### 4. API 層架構：簡化四層為兩層

原模板使用 `*.api.ts → *.app.ts → *.transform.ts → *.dto.ts` 四層架構。Heroes 功能的資料結構簡單，簡化為：
- `heroes.dto.ts`：API 回應型別
- `heroes.api.ts`：API 呼叫函式（直接回傳 data）

TanStack Query hooks 在 `hooks/` 目錄中包裝 API 呼叫。

**替代方案**：維持完整四層 → 對簡單 CRUD 過度工程。

### 5. Selected Hero Card 標示

使用 `border-primary` + `bg-primary/10` 標示選中卡片，搭配 `React.memo` 確保只有選中狀態變化的卡片 re-render。

### 6. Dark Mode 實作

使用 class-based dark mode（`<html class="dark">`），搭配 localStorage 持久化使用者偏好。不引入 `next-themes`，用簡單的 Zustand store 或原生 hook 管理。

### 7. 未儲存變更提醒

使用 TanStack Router 的 `useBlocker` hook，搭配 shadcn AlertDialog 作為確認對話框。同時監聽 `beforeunload` 事件處理瀏覽器關閉/重新整理。

## Risks / Trade-offs

| 風險 | 緩解措施 |
|------|---------|
| Heroku cold start 導致首次載入很慢 | axios timeout 15s、TanStack Query retry 2 次 + exponential backoff、Skeleton UI |
| 快速切換英雄產生 race condition | TanStack Query 的 queryKey 機制 + AbortSignal 自動取消前一個 request |
| 移除 auth interceptor 時可能遺漏其他有用邏輯 | 仔細審查 axios.ts，僅保留 case transform 和 error logging |
| Hahow API 可能回傳非預期格式 | Zod schema 驗證 API 回應，graceful error handling |
| `camelToSnake` 轉換可能影響 PATCH payload | 驗證 Hahow API 預期的 payload 格式（camelCase or snake_case） |
