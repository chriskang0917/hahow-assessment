# AI 輔助開發流程

本文件描述在此專案中，如何結合 **Superpowers**（Claude Code 技能系統）與 **OpenSpec**（規格驅動工作流）進行 AI 輔助開發。整套流程將需求從模糊構想推進到可驗證的實作，每一階段都有明確的產出物與品質關卡。

---

## 流程總覽

```mermaid
graph TD
    A["1. Brainstorming<br/>探索需求與邊界情境"] --> B["2. OpenSpec 建立規格<br/>proposal → specs → design → tasks"]
    B --> C["3. 建立 Worktree<br/>獨立分支處理功能"]
    C --> D["4. 拆分工作計畫<br/>writing-plans"]
    D --> E1["5a. 先讀再寫<br/>閱讀相關程式碼"]
    E1 --> E2["5b. 執行實作<br/>subagent 或直接開發"]
    E2 --> E3["5a-1. lazygit 確認 Diff<br/>逐行檢視、stage、commit"]
    E3 --> F1["6a. 先讀再寫<br/>閱讀測試與被測模組"]
    F1 --> F2["6b. TDD 驅動開發<br/>Red → Green → Refactor"]
    F2 --> F3["6a-1. lazygit 確認 Diff<br/>每輪 TDD 循環後檢視"]
    F3 --> G["7. Code Review<br/>AI + 人工審查"]
    G --> H["8. 封存專案<br/>OpenSpec archive"]
```

---

## 步驟詳解

### 1. Brainstorming — 探索需求與邊界情境

**使用工具：** Superpowers `brainstorming` skill 或 OpenSpec `/opsx:explore`

在動手寫任何程式碼之前，先透過 AI 進行發散式思考：

- 釐清需求的模糊地帶與隱含假設
- 列舉 edge cases 與可能的失敗情境
- 以 ASCII 圖表視覺化架構或資料流
- 評估技術選型的 trade-offs

**產出：** 對需求的完整理解、已識別的風險清單

**實際案例：** 在 `hero-features` 開發前，透過 brainstorming 識別出快速切換英雄的 race condition、能力值編輯的邊界條件（remaining = 0 時按增加、ability = 0 時按減少）等問題，並預先規劃解決方案。

---

### 2. OpenSpec 建立規格

**使用工具：** `/opsx:new`（逐步）或 `/opsx:ff`（快速）

建立結構化的變更規格，產出以下 artifacts：

| Artifact | 內容 | 檔案位置 |
|----------|------|----------|
| **Proposal** | 為什麼要做、做什麼、影響範圍 | `openspec/changes/<name>/proposal.md` |
| **Specs** | 需求規格、使用情境、驗收條件 | `openspec/changes/<name>/specs/` |
| **Design** | 技術設計、元件架構、API 設計 | `openspec/changes/<name>/design/` |
| **Tasks** | 可執行的任務清單（每項 ≤ 2 小時） | `openspec/changes/<name>/tasks/` |

OpenSpec 的 `config.yaml` 提供專案全域 context（tech stack、架構慣例、設計系統參考），確保 AI 產出的 artifacts 與現有架構一致。

**實際案例：**
- `hero-features` change：定義了 hero-list、hero-profile、app-shell 三個 capabilities
- `add-config-design-routing-conventions` change：擴充 config.yaml 以改善後續 AI 產出品質

**關鍵原則：**
- Proposal 使用繁體中文、500 字以內
- Tasks 控制在 2 小時以內
- API 相關 task 遵循四層架構（api → app → transform → dto）

---

### 3. 建立 Worktree — 獨立處理功能

**使用工具：** Superpowers worktree 功能（`git worktree`）

為每個功能建立獨立的 git worktree：

```bash
git worktree add ../hahow-assessment-hero-features feature/hero-features
```

**好處：**
- 功能開發與主分支完全隔離
- 可同時進行多個功能的開發
- 避免未完成的變更影響其他工作
- AI agent 在獨立環境中操作，不會干擾主工作目錄

---

### 4. 拆分工作計畫

**使用工具：** Superpowers `writing-plans` skill

根據 OpenSpec 產出的 tasks，進一步拆分為可執行的工作計畫：

- 確認任務之間的依賴關係與執行順序
- 識別可平行處理的獨立任務
- 為每個步驟定義明確的完成標準
- 評估哪些任務適合 AI 自主執行、哪些需要人工介入

**產出：** 結構化的執行計畫，包含步驟、依賴、預期產出

---

### 5. 執行實作 — Subagent 或直接開發

**使用工具：** Claude Code Agent tool / 直接使用 Edit、Write 等工具

#### 5a. 先讀再寫（Code-Aware 原則）

1. **讀取目標檔案** — 用 `lazygit` 工具逐一打開即將修改或新增的檔案，了解現有實作
2. **讀取相鄰檔案** — 確認同目錄下的 index、types、constants、utils 等，理解匯出慣例與共用邏輯
3. **記錄理解** — 在心中（或計畫中）簡要記下：這段程式碼做了什麼、為什麼這樣做、我即將做的改動如何與之銜接

**不允許的行為：**
- 未讀檔案就直接寫入或覆蓋
- 只看 function signature 就假設實作細節
- 跳過測試檔案的閱讀（測試揭示了預期行為與邊界條件）

**Subagent 也須遵守：** 當使用 Agent tool 分派任務時，prompt 中須明確要求 subagent 先讀取相關程式碼再動手實作。

#### 5a-1. 人工確認 Diff（lazygit）

AI 完成每一段程式碼修改後，我會透過 **lazygit** 逐行檢視變更：

1. **逐檔檢視 diff** — 在 Files panel 中選取每個變更檔案，確認：
   - 修改的每一行是否符合預期意圖
   - 是否有非預期的刪除或覆寫
   - 新增的程式碼是否與既有風格一致
3. **Stage 或丟棄** — 確認無誤的檔案 stage 進暫存區；有疑慮的變更直接丟棄或要求 AI 重做
4. **分批 commit** — 將邏輯相關的變更分組 commit，保持 commit 粒度乾淨

**原則：AI 產出的每一行程式碼，都必須經過開發者在 lazygit diff 中的知情確認，才能進入 commit。**

#### 5b. 選擇執行方式

根據任務特性選擇執行方式：

| 情境 | 執行方式 | 說明 |
|------|---------|------|
| 獨立且明確的任務 | **Subagent** | 平行處理多個不相依的任務，如同時建立多個元件 |
| 需要上下文或 hands-off 的任務 | **直接執行** | 涉及跨檔案邏輯、需要即時決策的工作 |
| 探索性任務 | **Explore agent** | 需要深入了解現有程式碼再決定做法 |

---

### 6. TDD 驅動開發（視情況）

**使用工具：** Superpowers TDD skill

#### 6a. 先讀再寫（同步驟 5a）

在進入 Red-Green-Refactor 循環之前，同樣必須先閱讀：

- **既有測試檔案與規範** — 了解目前的測試風格、命名慣例、mock 方式
- **被測模組的原始需求** — 確保測試案例覆蓋真實行為而非想像中的實作

#### 6a-1. 人工確認 Diff（lazygit）

每一輪 TDD 循環（Red / Green / Refactor）產出的變更，同樣須在 lazygit 中逐行確認後才 stage：

- **Red 階段** — 確認測試案例是否精準描述預期行為，assertion 是否合理
- **Green 階段** — 確認實作是否為最小可行方案，沒有偷渡多餘邏輯
- **Refactor 階段** — 確認重構後行為不變，diff 僅涉及結構調整

#### 6b. Red-Green-Refactor

對於核心業務邏輯，採用 Test-Driven Development：

1. **Red** — 先寫失敗的測試，定義預期行為
2. **Green** — 寫最少量的程式碼讓測試通過
3. **Refactor** — 在測試保護下重構

**適用場景：**
- 純邏輯的 custom hooks（如 `useAbilityEditor`）
- 資料轉換函式（transform 層）
- 邊界條件密集的功能

**測試慣例：**
- 測試檔案與 source 同目錄（`*.test.ts`）
- 使用 Vitest + Testing-library/react + happy-dom

---

### 7. Code Review — AI + 人工審查

**使用工具：** Superpowers `code-review` skill

雙層審查機制確保實作品質：

**AI Review（自動）：**
- 比對實作與 OpenSpec 規格的一致性
- 檢查程式碼風格與架構慣例
- 識別潛在的效能問題與安全漏洞
- 驗證測試覆蓋率

**人工 Review（手動）：**
- 審查 AI 的 review 結果
- 確認業務邏輯的正確性
- 評估 UX 與 accessibility
- 最終決策是否合併

---

### 8. 封存專案 — OpenSpec Archive

**使用工具：** `/opsx:archive` 或 `/opsx:bulk-archive`

完成實作後，將 change 封存以保留決策歷程：

1. **驗證完整性** — 檢查所有 artifacts 與 tasks 是否完成
2. **同步規格** — 將 delta specs 合併到主規格（`/opsx:sync`）
3. **封存** — 移動至 `openspec/changes/archive/YYYY-MM-DD-<name>/`

**封存後的結構：**
```
openspec/changes/archive/2026-03-14-add-config-design-routing-conventions/
├── .openspec.yaml     # 建立日期等 metadata
├── proposal.md        # 原始提案（凍結）
└── specs/             # 規格快照（凍結）
```

**價值：**
- 完整的決策歷史可追溯
- 新成員可透過 archive 了解每個功能的設計背景
- AI 可參考歷史 change 產出更一致的新 artifacts

---

## 工具對照表

| 流程階段 | Superpowers Skill | OpenSpec Command | 產出物 |
|----------|------------------|------------------|--------|
| 探索需求 | `brainstorming` | `/opsx:explore` | 需求理解、風險清單 |
| 建立規格 | — | `/opsx:new`, `/opsx:ff` | proposal, specs, design, tasks |
| 建立分支 | `worktree` | — | 獨立工作目錄 |
| 拆分計畫 | `writing-plans` | — | 結構化執行計畫 |
| 先讀再寫 | `Read` / `Explore agent` | — | 對現有程式碼的完整理解 |
| 執行實作 | `/executing-plans` | — | 程式碼 |
| 確認 Diff | `lazygit`（人工） | — | 知情確認後的 staged 變更 |
| TDD 先讀再寫 | `Read` | — | 對測試風格與被測模組的理解 |
| TDD 開發 | `tdd` | — | 測試 + 程式碼 |
| TDD 確認 Diff | `lazygit`（人工） | — | 每輪 TDD 循環的知情確認 |
| Code Review | `code-review` | `/opsx:verify` | Review 報告 |
| 封存 | — | `/opsx:archive` | 凍結的 change 記錄 |

---

## 何時不使用完整流程

並非所有變更都需要走完八個步驟：

| 變更類型 | 建議流程 |
|----------|---------|
| 修改部分需求的 config | 直接改，不需要 OpenSpec |
| 小型 bug fix 或介面、邏輯 | Brainstorming → 直接修 → Review |
