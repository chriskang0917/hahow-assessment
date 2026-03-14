## Context

目前 `openspec/config.yaml` 的 `rules` 僅定義 `proposal` 和 `tasks` 規則。專案 Makefile 提供標準化指令（`make check`、`make ts-check`、`make lint`、`make format`、`make dev`、`make build`），但 config 未引用這些指令，AI 產出的 artifact 缺乏與實際工具鏈的連結。

## Goals / Non-Goals

**Goals:**
- 在 `context` 補充 Makefile 可用指令，讓 AI 了解專案工具鏈
- 為所有 artifact 類型（proposal、design、specs、tasks）定義 `rules`
- tasks 規則要求包含驗證步驟，引用 Makefile targets

**Non-Goals:**
- 不修改 Makefile 本身
- 不變更現有 proposal/tasks 規則的核心語意
- 不新增 schema 或 workflow 定義

## Decisions

### 1. context 區塊新增 Makefile 指令清單

在 `context` 尾部新增 `Available Makefile targets` 區段，列出常用指令與用途。

**理由**：AI 撰寫 task 時需要知道有哪些標準化指令可引用，放在 context 可確保所有 artifact 類型都能參考。

### 2. rules 區塊補齊 design 和 specs 規則

- `design`：使用繁體中文、聚焦架構決策而非實作細節
- `specs`：使用 Given-When-Then 格式、每個 requirement 需可驗證

**理由**：統一所有 artifact 的撰寫規範，避免 AI 在不同 artifact 間風格不一致。

### 3. tasks 規則新增驗證指令要求

每個 task 須包含 `驗證方式` 欄位，引用對應的 Makefile target（如 `make check`、`make ts-check`）。

**理由**：確保開發者完成 task 後有明確的驗證步驟，減少遺漏。

## Risks / Trade-offs

- **規則過多導致 AI 輸出受限** → 保持規則精簡，每類 artifact 控制在 3-4 條以內
- **Makefile 指令變更需同步更新 config** → 風險低，Makefile 變動頻率極低
