## ADDED Requirements

### Requirement: Hero List 從 API 取得並顯示英雄列表

系統 SHALL 從 `GET /heroes` API 取得英雄列表，並以水平排列的方式顯示所有 Hero Card。Hero List SHALL 在頁面上水平置中。

#### Scenario: 成功載入英雄列表
- **WHEN** 使用者進入 `/heroes` 或 `/heroes/:heroId` 頁面
- **THEN** 系統從 API 取得英雄列表並顯示所有 Hero Card

#### Scenario: API 載入中
- **WHEN** 英雄列表 API 正在載入
- **THEN** 系統顯示 Skeleton placeholder（灰色方塊 + 文字 placeholder）

#### Scenario: API 載入失敗
- **WHEN** 英雄列表 API 回傳錯誤
- **THEN** 系統顯示錯誤訊息並提供重試按鈕

#### Scenario: API 回傳空列表
- **WHEN** API 回傳空陣列
- **THEN** 系統顯示 empty state 提示文字

### Requirement: Hero Card 包含圖片與名字且可點擊

每個 Hero Card MUST 包含英雄圖片和名字，且 MUST 是可點擊的連結，點擊後導航至該英雄的 Hero Profile Page。

#### Scenario: 點擊 Hero Card
- **WHEN** 使用者點擊某個 Hero Card
- **THEN** 瀏覽器導航至 `/heroes/:heroId`，HeroList 不重新 render

#### Scenario: 英雄圖片載入失敗
- **WHEN** Hero Card 的圖片 URL 無法載入
- **THEN** 系統顯示 fallback placeholder 圖片

### Requirement: Hero Card 響應式排列

Hero Card SHALL 在 Hero List 中由左到右排列，使用 flex wrap 佈局。在小尺寸螢幕上，超出畫面的元素 SHALL 自動往下排列。

#### Scenario: 大螢幕顯示
- **WHEN** 螢幕寬度足以容納所有 Hero Card
- **THEN** 所有 Card 在同一行水平排列

#### Scenario: 小螢幕顯示
- **WHEN** 螢幕寬度不足以容納所有 Hero Card
- **THEN** 超出的 Card 自動換行顯示

### Requirement: 選中的 Hero Card 視覺標示

當使用者在 Hero Profile Page 時，系統 MUST 用不同的視覺樣式標示目前選中的 Hero Card。

#### Scenario: 在 Hero Profile Page 查看英雄
- **WHEN** 使用者在 `/heroes/:heroId` 頁面
- **THEN** 對應的 Hero Card 顯示 `border-primary` 邊框和 `bg-primary/10` 背景色

#### Scenario: 在 Hero List Page
- **WHEN** 使用者在 `/heroes` 頁面（無選中英雄）
- **THEN** 所有 Hero Card 使用預設樣式，無特殊標示

### Requirement: HeroList 切換英雄時不重新 render

HeroList 元件 SHALL 在切換不同英雄時保持在相同位置，不因路由切換而 unmount/remount。

#### Scenario: 連續切換多個英雄
- **WHEN** 使用者依序點擊不同的 Hero Card
- **THEN** HeroList 元件保持 mounted 狀態，僅 Hero Profile 區域更新
