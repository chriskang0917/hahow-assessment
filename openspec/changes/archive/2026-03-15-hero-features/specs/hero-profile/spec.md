## ADDED Requirements

### Requirement: 顯示 Hero 能力值

Hero Profile SHALL 顯示英雄的能力值（STR、INT、AGI、LUK），資料從 `GET /heroes/:heroId/profile` API 取得。每個能力值左右各有一個 +/- 按鈕。

#### Scenario: 成功載入能力值
- **WHEN** 使用者進入 `/heroes/:heroId` 頁面
- **THEN** 系統從 API 取得並顯示該英雄的四個能力值（STR、INT、AGI、LUK）及對應的 +/- 按鈕

#### Scenario: 能力值 API 載入中
- **WHEN** 能力值 API 正在載入
- **THEN** 系統顯示 Skeleton placeholder

#### Scenario: 無效的 heroId
- **WHEN** URL 中的 heroId 不存在（API 回傳 404）
- **THEN** 系統顯示「找不到此英雄」錯誤訊息

### Requirement: 能力值增減功能

使用者 SHALL 能透過 +/- 按鈕調整英雄的能力值。能力值 MUST NOT 小於零。

#### Scenario: 增加能力值
- **WHEN** 使用者點擊某能力值的 `+` 按鈕
- **AND** 剩餘點數 > 0
- **THEN** 該能力值增加 1，剩餘點數減少 1

#### Scenario: 減少能力值
- **WHEN** 使用者點擊某能力值的 `-` 按鈕
- **AND** 該能力值 > 0
- **THEN** 該能力值減少 1，剩餘點數增加 1

#### Scenario: 能力值為零時按減少
- **WHEN** 某能力值 = 0
- **THEN** 該能力值的 `-` 按鈕 MUST 呈現 disabled 狀態，點擊無效

#### Scenario: 剩餘點數為零時按增加
- **WHEN** 剩餘點數 = 0
- **THEN** 所有能力值的 `+` 按鈕 MUST 呈現 disabled 狀態，點擊無效

### Requirement: 剩餘能力點數顯示

系統 SHALL 顯示剩餘的能力點數。初始預設值為 0（即所有點數已分配完畢）。剩餘點數 = 初始能力值總和 - 當前能力值總和。

#### Scenario: 初始載入
- **WHEN** 能力值從 API 載入完成
- **THEN** 剩餘點數顯示為 0

#### Scenario: 調整能力值後
- **WHEN** 使用者透過 +/- 按鈕調整能力值
- **THEN** 剩餘點數即時更新，反映當前未分配的點數

### Requirement: 儲存能力值

Hero Profile 最下方 SHALL 有一個儲存按鈕。按下後透過 `PATCH /heroes/:heroId/profile` 更新 server 資料。送出的能力值總和 MUST 與初始取得時相同。

#### Scenario: 成功儲存
- **WHEN** 使用者調整能力值使剩餘點數 = 0
- **AND** 點擊儲存按鈕
- **THEN** 系統發送 PATCH 請求更新能力值，成功後顯示 toast 通知

#### Scenario: 剩餘點數不為零時儲存
- **WHEN** 剩餘點數 != 0
- **THEN** 儲存按鈕 MUST 呈現 disabled 狀態，無法點擊

#### Scenario: 未做任何修改時儲存
- **WHEN** 使用者未修改任何能力值
- **THEN** 儲存按鈕 MUST 呈現 disabled 狀態

#### Scenario: 儲存失敗
- **WHEN** PATCH 請求失敗（網路錯誤、server 錯誤）
- **THEN** 系統顯示錯誤 toast 通知，保留當前編輯狀態，允許重試

#### Scenario: 儲存進行中
- **WHEN** PATCH 請求正在進行中
- **THEN** 儲存按鈕顯示 loading 狀態，防止重複提交

### Requirement: 切換英雄時未儲存變更提醒

當使用者在能力值有未儲存的修改時嘗試離開，系統 SHALL 彈出確認對話框提醒。

#### Scenario: 有未儲存修改時點擊其他 Hero Card
- **WHEN** 使用者已修改能力值但未儲存
- **AND** 點擊另一個 Hero Card
- **THEN** 系統彈出 AlertDialog 詢問是否放棄修改

#### Scenario: 確認離開
- **WHEN** 使用者在確認對話框中選擇「離開」
- **THEN** 系統放棄未儲存的修改，導航至新英雄的 Profile Page

#### Scenario: 取消離開
- **WHEN** 使用者在確認對話框中選擇「取消」
- **THEN** 系統保持在當前頁面，保留已修改的能力值

#### Scenario: 有未儲存修改時重新整理頁面
- **WHEN** 使用者已修改能力值但未儲存
- **AND** 嘗試重新整理或關閉瀏覽器
- **THEN** 瀏覽器顯示原生 beforeunload 確認對話框

### Requirement: 切換英雄時重置能力值

當使用者切換到不同英雄時，系統 SHALL 重新從 API 載入該英雄的能力值，重置編輯狀態。

#### Scenario: 切換英雄
- **WHEN** 使用者從 `/heroes/1` 導航至 `/heroes/2`
- **THEN** 系統載入英雄 2 的能力值，重置剩餘點數為 0
