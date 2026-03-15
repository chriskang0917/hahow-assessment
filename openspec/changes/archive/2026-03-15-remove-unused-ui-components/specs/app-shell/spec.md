## MODIFIED Requirements

### Requirement: 移除既有無關模組

系統 SHALL 移除所有與 Hahow Heroes 無關的功能模組，包括 auth、factory、supplier、root 模組及其相關路由、元件、hooks、services。系統 SHALL 同時移除 `src/components/ui/` 中未被使用的共用 UI 元件。

#### Scenario: 清理後的 features 目錄
- **WHEN** 清理完成
- **THEN** `src/features/` 目錄僅包含 `heroes/` 模組，不包含 auth、root 等舊模組

#### Scenario: 清理後的 routes 目錄
- **WHEN** 清理完成
- **THEN** `src/routes/` 僅包含 `__root.tsx`、`index.tsx`、`heroes/` 路由群組，不包含 `_protected`、`auth` 路由

#### Scenario: 移除無關依賴
- **WHEN** 清理完成
- **THEN** `package.json` 不包含 `@tanstack/react-form`、`@tanstack/react-table`、`file-saver`

#### Scenario: 清理後的 UI 元件目錄
- **WHEN** 清理完成
- **THEN** `src/components/ui/` 僅包含被使用的元件（`button.tsx`、`skeleton.tsx`、`alert-dialog.tsx`、`index.ts`），不包含 `pagination`、`link`、`card`、`label`、`search-bar`、`indeterminate-check-box`、`typography`、`alert`、`avatar`、`dialog`、`badge`、`table`、`dropdown-menu`、`select`、`input`

#### Scenario: Barrel export 一致性
- **WHEN** 清理完成
- **THEN** `src/components/ui/index.ts` 僅 re-export 存在且被使用的元件，無 broken import
