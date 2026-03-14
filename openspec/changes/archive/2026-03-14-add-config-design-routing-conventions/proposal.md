## Why

目前 `openspec/config.yaml` 的 context 缺少 UI 設計系統指引與路由/測試慣例。AI 在產生 artifacts 時無法得知專案的設計規範（色彩、間距、元件用法）、TanStack Router 的檔案命名模式，以及測試檔案的放置規則，導致產出需要額外人工校正。

## What Changes

- 在 `context` 中新增一行指向 `docs/DESIGN_GUIDE.md`，作為 UI 設計參考依據
- 在 `context` 中補充 TanStack Router 路由慣例：
  - Layout route 使用 `route.tsx`
  - Dynamic params 使用 `$paramName.tsx`
  - File-based routing 自動生成 `routeTree.gen.ts`
- 在 `context` 中補充測試慣例：
  - Test files co-located（`*.test.ts` 與 source 同目錄）
  - MSW handlers 放在 feature 的 `mocks/` 下

## Capabilities

### New Capabilities

- `openspec-config-conventions`: 擴充 config.yaml context，涵蓋設計系統參考、路由慣例、測試慣例

### Modified Capabilities

（無）

## Impact

- 僅影響 `openspec/config.yaml` 單一檔案
- 不影響任何 runtime code、API 或依賴
- 後續所有 OpenSpec artifact 生成將受益於更完整的 context
