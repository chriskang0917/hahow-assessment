# Hahow Heroes — 前端徵才小專案

## 線上展示

**Live Demo**：[https://hahow.chriskang.at/](https://hahow.chriskang.at/)

## 專案說明

這是 Hahow 前端工程師徵才專案，根據 Spec 的需求，實作一個「英雄列表與能力值編輯器」的頁面。使用者可以瀏覽英雄列表、點選英雄查看能力值，並在總點數不變的限制下調整各項能力值後儲存，並同步處理了主題切換、Skeleton、未儲存時的變更警告等功能，提升使用者的體驗。

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

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 執行測試
pnpm test

# 建置生產版本
pnpm build

# 程式碼檢查
pnpm lint

# 型別檢查
pnpm type-check
```

## 資料夾架構

```
src/
├── App.tsx                          # 應用程式進入點，掛載 Router 與 QueryClient
├── main.tsx                         # ReactDOM render
├── index.css                        # 全域樣式（Tailwind CSS）
├── routeTree.gen.ts                 # TanStack Router 自動產生的路由樹
├── components/
│   └── ui/                          # shadcn/ui 元件庫
│       ├── index.ts                 # 統一匯出入口
│       ├── alert-dialog.tsx         # AlertDialog 元件（Base UI）
│       ├── button.tsx               # Button 元件
│       └── skeleton.tsx             # Skeleton 骨架屏元件
├── constants/
│   └── hero.const.ts                # 英雄相關常數（ABILITY_KEYS, ABILITY_LABELS）
├── errors/
│   ├── schema-validation-error.ts   # API Schema 驗證錯誤類別
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
│       └── mocks/
│           └── heroes-handlers.ts    # MSW Mock Handlers
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
    ├── logger.ts                    # 日誌工具
    ├── response-with-schema.ts      # Zod Schema 驗證工具
    └── response-with-schema.test.ts # Schema 驗證工具測試
```

採用 **Feature-based 模組化設計**：將英雄功能相關的元件、Hooks、服務、型別、Mock 集中在 `features/heroes/` 下，使功能邊界清晰，方便擴展與維護。共用的 UI 元件與工具放在頂層 `components/`、`lib/`、`utils/`。

### API 服務層架構

每個 API 端點遵循分層設計：`*.api.ts`（HTTP 呼叫 + Zod 驗證）→ `*.app.ts`（業務邏輯組裝）→ `*.dto.ts`（API 回應型別）。Hooks 統一呼叫 `.app.ts`，不直接存取 `.api.ts`。

目前 app 層為 pass-through（直接回傳 API 結果），因 DTO 與 Domain 型別結構一致，無需額外轉換。隨業務複雜度增加，可在 app 層加入跨 API 組裝、資料合併等邏輯。若 API 回應格式與前端 Domain 型別差異較大，可額外新增 `*.transform.ts` 進行 DTO → Domain 的資料轉換。

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

`/heroes` 路由使用 TanStack Router 的 Layout Route，讓 `HeroList` 在父層級持久存在。當使用者點擊不同英雄時，只有 `<Outlet />` 內的 `HeroProfile` 會重新渲染，而英雄列表不會卸載或重新掛載，避免不必要的重複請求和閃爍。

## 設計理念

### 為什麼選擇 TanStack Router

- **型別安全**：路由參數（如 `heroId`）在編譯時期就有完整型別推導，消除 `useParams` 的 `string | undefined` 問題
- **Layout Route**：原生支援巢狀路由布局，處理「切換英雄時列表不重新渲染」的需求
- **File-based Routing**：檔案即路由，自動產生路由樹，減少手動維護成本
- **自動 Code Splitting**：每個路由自動拆分為獨立 chunk，提升首次載入速度

### 為什麼選擇 TanStack Query v5

- 將 server state 交由 Query 獨立處理，確保元件僅處理渲染
- **快取與重複請求消除**：相同的英雄資料只會發送一次請求，切換回已載入的英雄時立即顯示快取資料
- **Stale-While-Revalidate**：先顯示快取、背景更新，使用者感受不到延遲
- **自動重試與錯誤處理**：搭配 Heroku API 的 cold start 問題，內建重試機制大幅提升穩定性
- **Mutation 與快取同步**：儲存能力值後自動 invalidate 相關查詢，確保資料一致性

### 為什麼使用純 Custom Hook 管理能力值編輯

- 能力值編輯器的核心邏輯是「總點數不變」的約束驗證，這是特定的業務規則，可以透過拆分邏輯達到關注點分離的目的
- 純 Hook 更容易撰寫單元測試（不需要 DOM 環境，直接用 `renderHook` 測試）

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
| **Vitest + MSW** | 測試 | Vitest 與 Vite 生態整合，MSW 在網路層攔截模擬 API |
| **Biome + ESLint + Prettier** | 程式碼品質 | Biome 負責格式化與基礎檢查，ESLint 負責 React/Query 規則，Prettier 處理 Tailwind class 排序，並在使用 husky + linted-stage 在 git pre-commit 時進行 prettier format，避免依賴 VSCode Plugin |

## 註解原則

- **註解說明「為什麼」，而非「做了什麼」**：程式碼本身應該清楚表達 what，註解負責補充 why
- **僅在邏輯不自明時加註**：商業規則（如總點數不變的約束）、邊界情況處理、已知問題的 workaround
- **公開 Hook 使用 JSDoc**：為 `useAbilityEditor`、`useHeroes` 等公開介面撰寫 JSDoc，說明參數與回傳值
- **避免過度註解**：不為顯而易見的程式碼加註，減少維護負擔

## 遇到的困難與解決方法

### 1. Heroku API Cold Start

**問題**：Heroku 免費方案的應用程式在閒置後會進入休眠，首次請求可能需要數秒甚至超過 10 秒才能回應。

**解決方法**：
- 設定 Axios 超時為 15 秒，避免過早放棄請求
- TanStack Query 設定重試 3 次搭配 exponential backoff（3s → 6s → 12s），cold start 失敗後自動重試
- 載入期間顯示 Skeleton 骨架屏，提供視覺回饋，降低使用者焦慮感

### 2. 切換英雄時 HeroList 重新渲染

**問題**：在傳統路由設計中，切換到不同英雄的 URL 會導致整個頁面（包含英雄列表）重新渲染。

**解決方法**：
- 採用 TanStack Router 的 Layout Route 模式
- `HeroList` 放在 `/heroes` 的 Layout 層級，透過 `<Outlet />` 渲染子路由
- 切換英雄只觸發 `<Outlet />` 內的元件更新，列表保持不變

### 3. 能力值點數約束驗證

**問題**：使用者調整能力值時，必須確保四項能力值的總和始終等於初始總和。

**解決方法**：
- `useAbilityEditor` Hook 封裝完整邏輯：increment 時從剩餘點數扣除，decrement 時歸還
- 計算 `remainingPoints` 控制按鈕的啟用/停用狀態
- 儲存按鈕僅在 `remainingPoints === 0` 且 `isDirty` 時啟用
- 以 TDD 方式開發，確保所有邊界情況正確處理

### 4. 開發環境 CORS 問題

**問題**：前端開發伺服器直接請求 Heroku API 會遇到跨域限制。

**解決方法**：
- 在 `vite.config.ts` 設定 proxy，將 `/api` 前綴的請求代理至 Heroku API
- 開發環境透過 proxy 繞過 CORS，生產環境直接請求 API

## 加分項目

### UX 體驗優化

- **深色模式**：支援 `localStorage` 持久化偏好，並偵測系統 `prefers-color-scheme` 設定作為預設值
- **未儲存變更警告**：使用 TanStack Router 的 `useBlocker` 攔截路由切換，搭配 `beforeunload` 事件攔截頁面關閉，防止使用者意外遺失編輯中的資料
- **Skeleton 骨架屏載入**：英雄列表與能力值編輯器在載入時顯示骨架屏，而非空白或 spinner
- **圖片載入失敗 Fallback**：英雄頭像載入失敗時顯示替代圖示，而非破碎的圖片
- **響應式 Flex-wrap 排版**：英雄列表自動依螢幕寬度調整排列方式

### 程式碼品質提升

- **React.memo 優化 HeroCard**：避免列表中未選中的英雄卡片因父層狀態變更而不必要地重新渲染
- **Zod API 回應驗證**：所有 API 回應經過 Zod Schema 驗證，在 runtime 期間確保資料結構正確
- **Error Boundary 分層處理**：根路由層級的 Error Boundary 捕獲未預期錯誤，避免頁面錯誤或導致使用者困惑
- **API 服務分層架構**：`api` → `app` → `hook` 三層分離，各層職責清晰，方便單獨測試與替換
- **TDD 開發核心邏輯**：`useAbilityEditor` 以測試驅動開發，確保能力值編輯的所有邊界情況正確處理

## AI 工具使用

本專案使用 **Claude Code**（Anthropic CLI）作為 AI 輔助開發工具。

### 使用方式

- **架構討論**：與 AI 討論技術選型（TanStack Router vs React Router、狀態管理方案等），評估各方案的優缺點
- **實作計畫產生**：將需求拆解為具體的實作步驟與任務清單
- **元件開發**：透過子代理分工實作各功能模組，包含元件、Hook、服務層
- **TDD 測試撰寫**：先寫測試、再寫實作，確保 `useAbilityEditor` 等核心邏輯的正確性
- **程式碼審查**：AI 協助檢視程式碼品質、一致性、潛在問題

### 工作流程

1. 討論設計方案與架構決策
2. 產生分階段實作計畫
3. 透過子代理逐步實作各功能
4. 審查 AI 產生的程式碼，調整不符合專案慣例或品質標準的部分

所有 AI 產生的程式碼皆在生成後經過 code review 與調整，確保符合專案需求與程式碼品質標準。
