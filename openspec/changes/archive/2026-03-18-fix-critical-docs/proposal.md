## Why

專案 review 發現 `docs/PROJECT_ARCHITECTURE.md` 和 `docs/DESIGN_GUIDE.md` 描述的是完全不同的專案（react-template），包含 Zustand、Sentry、JWT refresh 等實際不存在的技術。Hahow reviewer 閱讀這些文件會產生嚴重矛盾印象。此外，README 中 `make init` 宣稱「初始化 MSW」但 Makefile 實際上沒有執行 MSW init，以及 ESLint 範圍描述不正確、資料夾樹缺少測試檔案。

## What Changes

- **移除** `docs/PROJECT_ARCHITECTURE.md` — 內容描述錯誤專案，無修復價值
- **移除** `docs/DESIGN_GUIDE.md` — 標題為 react-template，引用不存在的元件
- **新增** Makefile MSW init 步驟 — 在 `make init` 流程中加入 `npx msw init ./public --save`
- **修正** README 第三方套件表格中 ESLint 範圍描述（僅 TanStack Query 規則，非 React 規則）
- **修正** README 資料夾樹補上 `use-save-profile.test.tsx` 和 `query-client.test.ts`

## Capabilities

### New Capabilities

（無新增功能）

### Modified Capabilities

（無規格層級變更，僅文件與建置腳本修正）

## Impact

- `docs/PROJECT_ARCHITECTURE.md` — 刪除
- `docs/DESIGN_GUIDE.md` — 刪除
- `Makefile` — 新增 `check_msw_version` 定義，整合至 `init` target
- `README.md` — 修正 ESLint 描述、資料夾樹
