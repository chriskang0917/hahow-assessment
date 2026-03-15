## Why

`src/components/ui/` 目前有 18 個元件檔案，但實際被使用的只有 3 個（`button`、`skeleton`、`alert-dialog`）。其餘 15 個未使用的元件增加了 bundle size 與維護負擔，應予以移除以保持 codebase 精簡。

## What Changes

- **移除 15 個未使用的 UI 元件檔案**：`pagination`、`link`、`card`、`label`、`search-bar`、`indeterminate-check-box`、`typography`、`alert`、`avatar`、`dialog`、`badge`、`table`、`dropdown-menu`、`select`、`input`
- **更新 barrel export**：清理 `src/components/ui/index.ts`，移除已刪除元件的 re-export
- **保留 3 個使用中的元件**：`button.tsx`、`skeleton.tsx`、`alert-dialog.tsx`

## Capabilities

### New Capabilities

_無新增功能_

### Modified Capabilities

- `app-shell`: UI 元件庫縮減，移除未使用的共用元件（僅影響可用元件清單，不影響現有行為）

## Impact

- **受影響檔案**：15 個元件檔案刪除 + `index.ts` 更新
- **相依性**：無，已確認這些元件在專案中無任何 import
- **風險**：低，純刪除操作且已驗證無使用處
