## 1. 更新 context 區塊

- [x] 1.1 在 `openspec/config.yaml` 的 `context` 區塊尾部新增 `Available Makefile targets` 段落，列出 `make dev`、`make format`、`make lint`、`make check`、`make ci`、`make ts-check`、`make build` 及其用途說明

## 2. 補齊 rules 區塊

- [x] 2.1 在 `rules` 區塊新增 `design` 規則：使用繁體中文撰寫、聚焦架構決策非實作細節、保持精簡
- [x] 2.2 在 `rules` 區塊新增 `specs` 規則：使用 Given-When-Then 場景格式、每個 requirement 須可驗證、使用繁體中文撰寫
- [x] 2.3 在 `tasks` 規則中新增：每個 task 須包含驗證方式，引用對應的 Makefile target（如 `make check`、`make ts-check`）
