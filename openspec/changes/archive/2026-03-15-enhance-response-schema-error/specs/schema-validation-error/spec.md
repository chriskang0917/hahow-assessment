# schema-validation-error

## Purpose

提供結構化的 schema 驗證錯誤，讓 debug 時能快速定位是哪個 API endpoint 回傳了不符合預期的資料。

## Requirements

- `SchemaValidationError` 繼承 `Error`，包含以下 readonly 欄位：
  - `endpoint`: string — API 完整路徑
  - `method`: string — HTTP method
  - `status`: number — HTTP status code
  - `responseBody`: unknown — 實際回傳的資料
  - `requestBody`: unknown — 送出的 payload
  - `zodError`: ZodError — 原始 Zod 驗證錯誤
- `message` 格式：`[METHOD endpoint] Schema validation failed (HTTP status)`
- `name` 屬性為 `"SchemaValidationError"`
- `responseWithSchema` 接受 `AxiosResponse` 而非 `unknown`
- 驗證失敗時 throw `SchemaValidationError` 並 console.error flatten 後的錯誤
