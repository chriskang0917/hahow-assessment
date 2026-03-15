## ADDED Requirements

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

### Requirement: 簡化 App.tsx 和 Root Layout

`App.tsx` SHALL 移除 auth context、route masks，僅保留 QueryClientProvider 和 RouterProvider。`__root.tsx` SHALL 移除認證邏輯，僅渲染 Outlet 和全域 providers（Toaster）。

#### Scenario: App.tsx 簡化後
- **WHEN** 應用程式啟動
- **THEN** App.tsx 提供 QueryClientProvider 和 RouterProvider，不包含任何認證邏輯

#### Scenario: Root Layout 簡化後
- **WHEN** 應用程式啟動
- **THEN** `__root.tsx` 渲染 `<Outlet />` 和 `<Toaster />`（Sonner），不包含 auth 相關邏輯

### Requirement: 路由配置

系統 SHALL 配置以下路由，所有路由在使用者重新整理或直接輸入 URL 時 MUST 正常運作。

#### Scenario: 根路徑重導向
- **WHEN** 使用者訪問 `/`
- **THEN** 系統自動重導向至 `/heroes`

#### Scenario: 直接輸入 Hero Profile URL
- **WHEN** 使用者直接在瀏覽器輸入 `/heroes/2`
- **THEN** 系統同時載入英雄列表和英雄 2 的能力值，頁面正常顯示

#### Scenario: 不存在的路由
- **WHEN** 使用者訪問不存在的路由（如 `/unknown`）
- **THEN** 系統重導向至 `/heroes`

### Requirement: 簡化 Axios Instance

`src/lib/axios.ts` SHALL 保留 axios instance 和 camelCase↔snake_case 轉換邏輯，移除所有 auth 相關 interceptor（JWT refresh、401/403 處理）。baseURL 改用環境變數指向 Hahow API。

#### Scenario: API 請求自動轉換
- **WHEN** 發送 API 請求
- **THEN** request body 自動從 camelCase 轉為 snake_case，response data 自動從 snake_case 轉為 camelCase

#### Scenario: API 超時設定
- **WHEN** API 請求超過 15 秒未回應
- **THEN** 請求自動超時並觸發錯誤處理

### Requirement: Dark Mode 支援

系統 SHALL 支援 light/dark 兩種主題模式，使用者偏好 SHALL 儲存至 localStorage。

#### Scenario: 切換主題
- **WHEN** 使用者點擊主題切換按鈕
- **THEN** 系統在 `<html>` 元素上切換 `dark` class，UI 即時更新

#### Scenario: 持久化主題偏好
- **WHEN** 使用者選擇 dark mode 後重新整理頁面
- **THEN** 系統從 localStorage 讀取偏好，自動套用 dark mode

#### Scenario: 系統預設
- **WHEN** 使用者首次訪問且未設定偏好
- **THEN** 系統使用 `prefers-color-scheme` 媒體查詢偵測系統偏好

### Requirement: Toast 通知

系統 SHALL 使用 Sonner 提供操作回饋的 toast 通知。

#### Scenario: 操作成功
- **WHEN** 能力值儲存成功
- **THEN** 系統顯示成功 toast 通知

#### Scenario: 操作失敗
- **WHEN** API 請求失敗
- **THEN** 系統顯示錯誤 toast 通知

### Requirement: Error Boundary

系統 SHALL 提供分層的 Error Boundary，局部錯誤不影響整體應用。

#### Scenario: Hero Profile 載入錯誤
- **WHEN** Hero Profile API 發生未預期的錯誤
- **THEN** 僅 Hero Profile 區域顯示錯誤狀態，Hero List 正常顯示

#### Scenario: 全域未捕獲錯誤
- **WHEN** 應用發生未捕獲的 JavaScript 錯誤
- **THEN** Root Error Boundary 顯示全域錯誤頁面，提供重新載入選項
