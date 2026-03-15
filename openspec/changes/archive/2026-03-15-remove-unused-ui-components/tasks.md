## 1. 刪除未使用的 UI 元件檔案

- [x] 1.1 刪除以下 15 個未使用的元件檔案：`pagination.tsx`、`link.tsx`、`card.tsx`、`label.tsx`、`search-bar.tsx`、`indeterminate-check-box.tsx`、`typography.tsx`、`alert.tsx`、`avatar.tsx`、`dialog.tsx`、`badge.tsx`、`table.tsx`、`dropdown-menu.tsx`、`select.tsx`、`input.tsx`。驗證：確認 `src/components/ui/` 僅剩 `button.tsx`、`skeleton.tsx`、`alert-dialog.tsx`、`index.ts`

## 2. 更新 Barrel Export

- [x] 2.1 更新 `src/components/ui/index.ts`，移除已刪除元件的 re-export，僅保留 `button`、`skeleton`、`alert-dialog` 的 export。驗證：`make ts-check` 通過

## 3. 驗證

- [x] 3.1 執行 `make ts-check` 確認 TypeScript 編譯無錯誤
- [x] 3.2 執行 `make check` 確認 Biome lint/format 通過（既有 lint 問題不在本次變更範圍）
