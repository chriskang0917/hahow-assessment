# Hahow Heroes — 前端徵才小專案

## 線上展示

**Live Demo**：[https://hahow.chriskang.at/](https://hahow.chriskang.at/)

## 專案說明

這是 Hahow 前端工程師徵才專案，根據 Spec 需求實作「英雄列表與能力值編輯器」頁面。使用者可以瀏覽英雄列表、點選英雄查看能力值，並在總點數不變的限制下調整各項能力值後儲存，並同步處理了主題切換、Skeleton、未儲存時的變更警告等功能，提升使用者的體驗。

## 如何執行

### 前置需求

- Node.js 20+（透過 [fnm](https://github.com/Schniz/fnm) 管理，`make init` 會自動安裝）
- pnpm 10+
- [Docker](https://docs.docker.com/get-docker/)（僅建置 Docker image 時需要）

### 使用 Makefile 快速啟動

```bash
# 1. 初始化開發環境（自動安裝 fnm、pnpm、Docker，設定 Node.js 版本、安裝依賴、複製 .env）
make init

# 2. 啟動開發伺服器
make dev
```

### 所有 Make 指令

| 指令 | 說明 |
|------|------|
| `make init` | 初始化開發環境（安裝工具、依賴、設定 Node.js 版本、複製 .env、初始化 MSW） |
| `make dev` | 安裝依賴並啟動開發伺服器 |
| `make setup-node` | 檢查並切換 Node.js 版本（依據 `.nvmrc`） |
| `make format` | 使用 Biome 格式化程式碼 |
| `make lint` | 執行 Biome lint 檢查 |
| `make check` | 執行 Biome check（格式化 + lint） |
| `make ci` | 執行 Biome CI 檢查 |
| `make ts-check` | 執行 TypeScript 型別檢查 |
| `make build` | 建置 Docker image 並推送至 registry |
| `make build-local` | 僅建置 Docker image（不推送） |
| `make build-push` | 僅推送 Docker image 至 registry |
| `make build branch=main` | 切換到指定分支（`main` 或 `develop`）後建置 |

### 不使用 Makefile
在不使用 Makefile 的情況下，仍然可以使用 pnpm 啟動專案，
只是就會少了自動處理 node 版本、套件安裝等流程。

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 執行測試
pnpm test

# 建置並推送生產版本
pnpm build

# 程式碼檢查
pnpm lint

# 型別檢查
pnpm type-check
```

## 測試

```bash
# 執行所有測試
pnpm test

# 監聽模式
pnpm test --watch
```



## 資料夾架構

```
src/
├── App.tsx                          # 應用程式進入點，掛載 Router 與 QueryClient
├── main.tsx                         # ReactDOM render
├── index.css                        # 全域樣式（Tailwind CSS）
├── routeTree.gen.ts                 # TanStack Router 自動產生的路由樹
├── components/
│   └── ui/                          # shadcn/ui 元件庫（Base UI）
│       ├── index.ts                 # 統一匯出入口
│       ├── alert-dialog.tsx         # AlertDialog 元件
│       ├── button.tsx               # Button 元件
│       └── skeleton.tsx             # Skeleton 骨架屏元件
├── constants/
│   └── hero.const.ts                # 英雄相關常數（ABILITY_KEYS, ABILITY_LABELS）
├── errors/
│   ├── schema-validation-error.ts   # API Schema 驗證錯誤類別，擴充處理 Zod 驗證失敗後的錯誤訊息
│   └── schema-validation-error.test.ts # Schema 驗證錯誤測試
├── features/
│   └── heroes/
│       ├── components/
│       │   ├── hero-card.tsx         # 英雄卡片（React.memo 優化）
│       │   ├── hero-card-skeleton.tsx# 英雄卡片骨架屏
│       │   ├── hero-list.tsx         # 英雄列表
│       │   ├── hero-profile.tsx      # 英雄能力值編輯器
│       │   ├── hero-profile-skeleton.tsx # 能力值骨架屏
│       │   ├── ability-row.tsx       # 單一能力值列（+/- 按鈕）
│       │   ├── dark-mode-toggle.tsx  # 深色模式切換
│       │   └── unsaved-changes-blocker.tsx # 未儲存變更攔截
│       ├── hooks/
│       │   ├── use-heroes.ts         # 英雄列表 Query Hook
│       │   ├── use-hero-profile.ts   # 英雄能力值 Query Hook
│       │   ├── use-ability-editor.ts # 能力值編輯純邏輯 Hook
│       │   ├── use-ability-editor.test.ts # 編輯器 Hook 單元測試
│       │   └── use-save-profile.ts   # 儲存能力值 Mutation Hook
│       ├── services/
│       │   ├── heroes.app.ts         # 英雄列表 Application 層（組裝 API）
│       │   ├── heroes.api.ts         # 英雄列表 API 層（HTTP 呼叫）
│       │   ├── heroes.dto.ts         # 英雄列表 DTO 型別
│       │   ├── heroes.schema.ts      # 英雄列表 Zod Schema
│       │   ├── hero-profile.app.ts   # 英雄能力值 Application 層
│       │   ├── hero-profile.api.ts   # 英雄能力值 API 層
│       │   ├── hero-profile.dto.ts   # 英雄能力值 DTO 型別
│       │   ├── hero-profile.schema.ts# 英雄能力值 Zod Schema
│       │   ├── save-profile.app.ts   # 儲存能力值 Application 層
│       │   └── save-profile.api.ts   # 儲存能力值 API 層
├── lib/
│   ├── axios.ts                     # Axios 實例（攔截器、超時設定）
│   ├── query-client.ts              # TanStack Query Client 設定
│   └── utils.ts                     # 通用工具（cn）
├── routes/
│   ├── __root.tsx                   # 根路由（Error Boundary、Sonner）
│   ├── index.tsx                    # 首頁（重導至 /heroes）
│   └── heroes/
│       ├── route.tsx                # Layout Route（HeroList + Outlet）
│       ├── index.tsx                # /heroes 首頁（提示選擇英雄）
│       └── $heroId.tsx              # /heroes/:heroId（英雄能力值頁）
├── types/
│   └── hero.type.ts                 # 英雄相關型別定義（Hero, HeroProfile, AbilityKey）
└── utils/
    ├── case-transform.ts            # snake_case / camelCase 轉換
    ├── case-transform.test.ts       # 轉換函式測試
    ├── response-with-schema.ts      # Zod Schema 驗證工具
    └── response-with-schema.test.ts # Schema 驗證工具測試
```

採用 **Feature-based 模組化設計**：將英雄功能相關的元件、Hooks、服務、型別 集中在 `features/heroes/` 下，使功能邊界清晰，方便擴展與維護。共用的 UI 元件與工具放在頂層 `components/`、`lib/`、`utils/`。

### API 服務層架構

每個 API 端點遵循分層設計：`*.api.ts`（axios 呼叫）→ `*.app.ts`（業務邏輯組裝）→ `*.dto.ts`（API 回應型別）。Hooks 統一呼叫 `.app.ts`，不直接存取 `.api.ts`。

目前 app 層為 pass-through（直接回傳 API 結果），因 DTO 與 Domain 型別結構一致，無需額外轉換。隨業務複雜度增加，可在 app 層加入 `*.transform.ts` 進行 API 組裝、資料合併等邏輯。

## Application 邏輯架構

```
App
└── RouterProvider
    └── __root (ErrorBoundary + Sonner Toast)
        └── / (Redirect → /heroes)
        └── /heroes — Layout Route (HeroesLayout)
            ├── HeroList（持久顯示，不因子路由切換而重新渲染）
            ├── DarkModeToggle
            └── <Outlet />
                ├── /heroes (index) → 「請選擇一位英雄」提示
                └── /heroes/:heroId → HeroProfile
                    ├── AbilityRow × 4 (str, int, agi, luk)
                    ├── UnsavedChangesBlocker
                    └── 儲存按鈕
```

### Layout Route 模式

`/heroes` 路由使用 TanStack Router 的 Layout Route，讓 `HeroList` 在父層級持久存在。當使用者點擊不同英雄時，只有 `<Outlet />` 內的 `HeroProfile` 會重新渲染，而英雄列表不會卸載或重新掛載，除達成 spec 需求，也避免不必要的重複請求和閃爍。

## 設計理念

### 為什麼選擇 TanStack Router

- **型別安全**：路由參數（如 `heroId`）在編譯時期就有完整型別推導，消除 `useParams` 的 `string | undefined` 問題
- **File-based Routing**：檔案即路由，自動產生路由樹，減少手動維護成本
- **自動 Code Splitting**：每個路由自動拆分為獨立 chunk，提升首次載入速度，React Router 仍需包裹 lazy 進行處理

### 為什麼選擇 TanStack Query v5

- 將 server state 交由 Query 獨立處理，確保元件僅處理渲染
- **快取與重複請求消除**：相同的英雄資料只會發送一次請求，切換回已載入的英雄時立即顯示快取資料
- **Stale-While-Revalidate**：自動 refetch 資料，確保使用者在一定時間下可以自動更新資料
- **自動重試與錯誤處理**：搭配 Heroku API 的 cold start 問題，內建重試機制大幅提升穩定性

### 為什麼使用純 Custom Hook 管理能力值編輯

- 能力值編輯器的核心邏輯是「總點數不變」的約束驗證，這是特定的業務規則，可以透過拆分邏輯達到關注點分離的目的
- 純 Hook 更容易撰寫單元測試（不需要 DOM 環境，直接用 `renderHook` 測試）

### 為什麼使用 API 分層結構

- 透過將 API 的 fetch、資料轉換、type 定義、Schema 驗證、server state 的關注點分拆，每一個部分都可以只專注在該角色上
- 後續若有功能或 API 調整，可以幾乎避免在元件內部處理資料

### 為什麼使用 features 集中管理

- 透過 features 的集中管理，相關的檔案在功能擴充時，不會有照不到的問題，所有相關的檔案都有高內聚、低耦合的特性，方便後續維護
- 透過相同的架構規劃，方便開發者快速找到對應的檔案

### 為什麼不使用 Single Hero API（`GET /heroes/:heroId`）

評估後選擇不使用單一英雄 API，原因如下：

1. **資料完全重複**：Single Hero API 回傳的資訊與 Hero List API 提供的資料結構與內容完全相同，額外請求只是取得已有的資料
2. **Hero List 必定存在**：英雄列表始終顯示在畫面上，因此 Hero List API 一定會被呼叫，其回應中已包含所有英雄的基本資訊
3. **無法預先顯示 Card**：即使在直接載入 `/heroes/:heroId` 的情況下，由於沒有 Hero List 對應的資料，也無法預先顯示可能的英雄卡片位置，仍需等待 List API 回應

**會考慮使用的情況**：除非 Hero List API 延遲非常嚴重（需要先顯示單一英雄資訊作為降級方案），或是 Single Hero API 提供了 List 中沒有的額外資訊，否則耗費額外的網路資源取得相同的資料並不合理。

### 測試策略

- **純邏輯單元測試**：`useAbilityEditor`、`case-transform`、`response-with-schema` 等不涉及 HTTP 的模組，直接以 Vitest 測試
- **API 整合測試**：使用 **MSW (Mock Service Worker)** 攔截 HTTP 請求，模擬後端回應，驗證 Mutation Hook 在各種狀態碼（200、400、404、500）下的行為

= **MSW 使用方式**：專案使用 MSW v2 的 **Node 模式**（`msw/node`），僅在測試環境中運行，不影響開發環境（開發環境透過 Vite proxy 連接實際 API）。

## 第三方 Library

| Library | 用途 | 選擇原因 |
|---------|------|----------|
| **React 19 + TypeScript** | UI 框架 | 業界標準，型別安全 |
| **Vite 6 + SWC** | 建置工具 | 極速 HMR，SWC 編譯比 Babel 快 20 倍以上 |
| **TanStack Router** | 型別安全路由 | 主要原生支援型別路由，克服原先 React Router 需要手動撰寫型別的維護成本，file-based routing，自動 code splitting |
| **TanStack Query v5** | 伺服器狀態管理 | 快取、去重、stale-while-revalidate、自動重試 |
| **Axios** | HTTP 客戶端 | 支援 middleware 的處理（snake_case/camelCase 自動轉換）等設定 |
| **shadcn/ui + Tailwind CSS v4** | UI 元件 + 樣式 | 可客製化的 headless 元件搭配 utility-first CSS。底層選擇 BASE UI 取代原先的 Radix UI，考量為：MUI 團隊的 full-time 維護支援、Tree-shakable、統一的套件更新管理、更高階的元件設計、完整的 TypeScript 支持。取捨是部分成熟的第三方套件生態支援較少，但目前功能需求皆可達成。樣式方面，評估 CSS-in-JS 在專案成長時容易產生重複性 CSS，且 styled-components 已停止更新新功能，因此採用 Tailwind utility-first 方案 |
| **Zod** | 執行期型別驗證 | 驗證 API 回應結構，確保資料符合預期 Schema |
| **Sonner** | Toast 通知 | 美觀的通知元件，API 簡潔 |
| **Lucide React** | 圖示 | Tree-shakable，與 shadcn/ui 搭配良好 |
| **Vitest** | 測試框架 | Vitest 與 Vite 生態整合，共用相同設定 |
| **MSW (Mock Service Worker)** | API Mocking | 在測試環境中攔截 HTTP 請求，模擬各種 API 回應（成功、錯誤狀態碼），無需啟動真實後端即可進行整合測試 |
| **Biome + ESLint** | 程式碼品質 | Biome 負責格式化、基礎檢查與 Tailwind class 排序（`useSortedClasses`），ESLint 負責 React/Query 規則 |

## 註解原則

- **註解說明「為什麼」，而非「做了什麼」**：程式碼本身應該清楚表達 what，註解負責補充 why
- **避免過度註解**：不為顯而易見的程式碼加註，盡可能優先使用變數名稱進行說明

## 遇到的困難與解決方法

### 1. 切換不同英雄時，會有總和閃爍的問題

**問題**：原先透過 useMemo 紀錄英雄的初始總和值，但發現切換英雄時會有總和閃爍的問題

**解決方法**：
後來參考 React Doc 的 “You Might Not Need an Effect” 一文，直接在元件內透過比較兩個值是否相等，
如果不相等就在元件內 render 時同步 state，避免會有 state 的延遲。

### 2. 在同一個 Profile 顯示初始資料與編輯後的資料 

**問題**：使用者調整能力值時，要確保使用者知道現在的值是初始值還是編輯後，以及現在是否可以送出編輯

**解決方法**：
儲存按鈕僅在 `remainingPoints === 0` 且 `isDirty` （initial 和 current 的值只要有任一不同） 時，
才 enbable Submit 的按鈕，避免送出錯誤的數值，並在成功送出後再次 isDirty = false 重置狀態

### 3. TanStack Query 的 retry 邏輯不正確

**問題**：就算回覆的是如 400 等錯誤，因為仍會觸發 onError 而導致 retry

**解決方法**：
因此僅將無法連線 ERRCONNECT 跟 500 以上等錯誤涵括在重試中，如果接收到的為 400 系列就終止重試，
因為 400 系列代表代表伺服器無法處理請求，通常因請求語法錯誤、格式無效或路由問題所致，幾乎不會因為重試就成功，
除非如 408 (伺服器等待逾時) 或 429 (Too Many Request) 等錯誤碼，其餘都直接顯示相對應或通用錯誤

### 4. 嘗試將整個專案部署到個人的 Server 上
第一次從零到一建立 Dockerfile + nginx，並為避免將專案在 server 上打包消耗 server 資源與處理環境問題，
直接將二階段建置完的 Docker image 上傳到 DockerHub，並在 Server 上 Docker pull + Docker run 跑在 server 上，
最後再透過反向代理將 3001:80 port 進行映射，成功讓網站在個人的子網域上顯示

## 加分項目

### UX 體驗優化

- **深色模式**：支援 `localStorage` 持久化偏好，並偵測系統 `prefers-color-scheme` 設定作為預設值
- **未儲存變更警告**：使用 TanStack Router 的 `useBlocker` 攔截路由切換，搭配 `beforeunload` 事件攔截頁面關閉，防止使用者意外遺失編輯中的資料
- **Skeleton 載入**：英雄列表與能力值編輯器在載入時顯示 Skeleton，而非空白或 Shifting
- **圖片載入失敗 Fallback**：英雄頭像載入失敗時使用 No Image 顯示替代顯示，而非破碎的圖片

### 程式碼品質提升

- **React.memo 優化 HeroCard**：避免列表中未選中的英雄卡片因父層狀態變更而不必要地重新渲染
- **Zod API 回應驗證**：所有 API 回應經過 Zod Schema 驗證，在 runtime 期間確保資料結構正確，同時也有 fallback 的值避免頁面 crash，如果在開發時有錯誤，也有自定義的 Schema Error Type 可以除錯
- **Error Boundary 分層處理**：根路由層級的 Error Boundary 捕獲未預期錯誤，避免頁面錯誤或導致使用者困惑
- **API 服務分層架構**：`api` → `app` → `hook` 三層分離，各層職責清晰，方便單獨測試與替換
- **TDD 開發核心邏輯**：`useAbilityEditor` 以測試驅動開發，確保能力值編輯的所有邊界情況正確處理，同時藉由抽象業務邏輯，維持元件本身的乾淨

## AI 工具使用

本專案使用 **Claude Code**（Anthropic CLI）作為 AI 輔助開發工具，搭配 **Superpowers**（技能系統）與 **OpenSpec**（規格驅動工作流）建立結構化的開發流程。

### 流程摘要

```
Brainstorming → OpenSpec 規格 → 工作計畫 → 先讀再寫 → 實作 → lazygit 確認 Diff → TDD → Code Review → 封存
```

| 階段 | 說明 |
|------|------|
| **Brainstorming** | 發散式思考，釐清需求、列舉 edge cases、評估 trade-offs |
| **OpenSpec 規格** | 產出 proposal → specs → design → tasks，確保 AI 產出與架構一致 |
| **先讀再寫** | 每次編輯前必須閱讀目標檔案、相鄰檔案與上下游依賴 |
| **實作** | 依任務特性選擇 subagent 平行處理或直接開發 |
| **lazygit 確認 Diff** | AI 產出的每一行程式碼，皆經開發者在 lazygit 中逐行確認後才 commit |
| **TDD** | 核心業務邏輯採 Red → Green → Refactor 循環 |
| **Code Review** | AI 自動審查 + 人工最終決策 |

### 核心原則

- **所有 AI 產出皆經人工審查**：透過 lazygit 逐行確認 diff，確保每次 commit 都在開發者知情下完成
- **規格驅動**：OpenSpec 提供結構化的需求→設計→任務流程，避免 AI 偏離架構慣例
- **並非所有變更都走完整流程**：小型 bug fix 可直接 Brainstorming → 修復 → Review

> 完整流程文件請參考 [AI 輔助開發流程](docs/AI_WORKFLOW.md)
