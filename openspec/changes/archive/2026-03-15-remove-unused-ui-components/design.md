## Context

`src/components/ui/` 包含 18 個 Shadcn UI 元件，但僅有 `button`、`skeleton`、`alert-dialog` 被使用。其餘 15 個元件為早期專案架構遺留，目前無任何 import 參照。

## Goals / Non-Goals

**Goals:**
- 移除 15 個未使用的 UI 元件檔案
- 更新 `index.ts` barrel export，僅保留使用中的元件
- 確保移除後 TypeScript 編譯與 lint 通過

**Non-Goals:**
- 不重構現有使用中的元件
- 不調整元件 API 或樣式
- 不移除 `src/components/common/` 或 `src/components/form/` 的元件

## Decisions

### 直接刪除策略
直接刪除檔案而非標記 deprecated。因為這些元件完全無使用，不需要漸進式移除。

### 保留 barrel export 結構
維持 `index.ts` 作為 barrel export 入口，僅移除已刪除元件的 export 行。保持與其他模組一致的 import 模式。

## Risks / Trade-offs

- **[未來需要被刪除的元件]** → 需要時可透過 `npx shadcn@latest add <component>` 重新安裝，Shadcn CLI 支援隨時新增
- **[遺漏使用處]** → 已透過全域搜尋確認無 import，且移除後會執行 `make ts-check` 驗證
