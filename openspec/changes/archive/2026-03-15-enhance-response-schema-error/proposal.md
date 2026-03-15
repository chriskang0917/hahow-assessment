## Why

`responseWithSchema` 驗證失敗時只拋出原始的 `ZodError`，沒有包含任何 API 上下文資訊（endpoint、HTTP method、status code、response body），導致在 console、error tracking 服務和 UI 上都難以定位問題。

## What Changes

- 新增 `SchemaValidationError` 自訂 Error class，結構化存放 debug 資訊
- 重構 `responseWithSchema` 接受完整 `AxiosResponse` 而非已解構的 `data`
- 更新所有呼叫端傳入完整 response

## Capabilities

### New Capabilities
- `schema-validation-error`: 結構化的 schema 驗證錯誤，包含 endpoint、method、status、responseBody、requestBody

### Modified Capabilities
（無）

## Impact

- 新增 `src/errors/schema-validation-error.ts`
- 修改 `src/utils/response-with-schema.ts`（簽名變更 — breaking change）
- 修改 `heroes.api.ts`、`hero-profile.api.ts` 呼叫方式
- `save-profile.api.ts` 不受影響（不使用 `responseWithSchema`）
