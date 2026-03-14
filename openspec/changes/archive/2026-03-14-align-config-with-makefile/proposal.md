## Why

目前 `openspec/config.yaml` 的 `rules` 區塊僅定義了 `proposal` 和 `tasks` 兩類 artifact 的撰寫規範，但專案已有完整的 Makefile 工作流（`make check`、`make ts-check`、`make lint`、`make format` 等）。config 缺少對這些工具鏈的引用，導致 AI 產出的 task 和 design 文件無法明確指引開發者使用正確的驗證指令。

## What Changes

- 在 `rules` 區塊新增 `design` 類別規則，規範 design artifact 的撰寫方式
- 在 `rules` 區塊新增 `specs` 類別規則，規範 spec artifact 的撰寫方式
- 調整 `tasks` 規則，要求每個 task 包含對應的驗證指令（引用 Makefile targets）
- 在 `context` 區塊補充 Makefile 可用指令清單，讓 AI 知道專案有哪些標準化指令可用

## Capabilities

### New Capabilities

_無新增 capability_

### Modified Capabilities

- `openspec-config-conventions`：新增 rules 區塊須涵蓋所有 artifact 類型的要求，以及 context 須包含 Makefile 工具鏈資訊的要求

## Impact

- 影響檔案：`openspec/config.yaml`
- 影響範圍：所有後續透過 OpenSpec 產出的 artifact 品質與一致性
- 無程式碼或 API 變更，純屬工作流配置調整
