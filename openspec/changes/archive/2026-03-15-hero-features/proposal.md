## Why

目前 repo 是從 supplier-link-frontend 模板建立，尚未實作 Hahow 前端 assessment 要求的核心功能：Hero 列表瀏覽與能力值管理。需要清理既有無關程式碼，並建立完整的 Hero 功能模組，以滿足 take-home assignment 的必要與加分項目。

## What Changes

- **BREAKING** 移除既有 auth、factory、supplier、root 功能模組及相關路由
- 簡化 `App.tsx` 和 `__root.tsx`，移除認證邏輯與 route masks
- 新增 `src/features/heroes/` 功能模組（components、hooks、services）
- 新增路由：`/heroes`（列表頁）、`/heroes/:heroId`（能力值頁）
- 根路徑 `/` 重導向至 `/heroes`
- 整合 Hahow API（GET heroes、GET profile、PATCH profile）
- 新增 dark mode 支援
- 新增未儲存變更離開提醒
- 移除不需要的依賴（`@tanstack/react-form`、`@tanstack/react-table`、`file-saver`）
- 新增 `sonner` 依賴（toast 通知）

## Capabilities

### New Capabilities

- `hero-list`: Hero 列表展示 — 從 API 取得英雄資料，以 flex wrap 水平排列 Hero Card，支援響應式、selected 狀態標示、loading skeleton
- `hero-profile`: Hero 能力值管理 — 顯示能力值（STR/INT/AGI/LUK），+/- 按鈕增減，剩餘點數計算，儲存至 API，未儲存離開提醒
- `app-shell`: 應用外殼與清理 — 移除既有無關模組，簡化 root layout，設定 dark mode、toast provider、error boundary

### Modified Capabilities

（無既有 spec 需修改）

## Impact

- **路由**：完全重建，移除 `_protected`、`auth` 路由，新增 `heroes` 路由群組
- **API**：複用 `src/lib/axios.ts`，新增 heroes service 層
- **依賴**：移除 3 個、新增 1 個（sonner）
- **既有元件**：保留 `src/components/ui/` shadcn 元件，移除 `data-table`、`form/field-info`
