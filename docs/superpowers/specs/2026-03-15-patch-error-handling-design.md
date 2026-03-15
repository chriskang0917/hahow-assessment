# PATCH Error Handling Design

## Summary

為 PATCH `/heroes/{heroId}/profile` 加入依 HTTP 狀態碼區分的錯誤訊息，並讓 4xx client error 不進行重試。

## Requirements

- PATCH 收到 404 時，顯示 toast：「找不到該英雄，請再選擇其他英雄嘗試」
- PATCH 收到 400 時，顯示 toast：「輸入的值不正確，請確認後再次送出」
- 其他錯誤維持現有訊息：「儲存失敗，請重試」
- 404 後不自動導航，使用者自行選擇
- Query 層級的 4xx (400-499) client error 不重試（mutation 預設已不重試）

## Approach

直接在現有程式碼中修改，不引入新的抽象層。

## Changes

### 1. `src/features/heroes/hooks/use-save-profile.ts`

在 `onError` callback 中使用 `isAxiosError` 判斷錯誤型別，根據 `error.response?.status` 顯示對應訊息：

```ts
import { isAxiosError } from "axios";

onError: (error) => {
  if (isAxiosError(error) && error.response) {
    switch (error.response.status) {
      case 404:
        toast.error("找不到該英雄，請再選擇其他英雄嘗試");
        return;
      case 400:
        toast.error("輸入的值不正確，請確認後再次送出");
        return;
    }
  }
  toast.error("儲存失敗，請重試");
},
```

### 2. `src/lib/query-client.ts`

將 `queries.retry: 3` 改為函式，4xx 錯誤不重試。Mutation 預設 `retry: 0`，無需額外處理。`retryDelay` 保持不變。`isAxiosError` 是正確的 type guard，不需額外型別斷言：

```ts
import { isAxiosError } from "axios";

retry: (failureCount, error) => {
  if (isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) {
    return false;
  }
  return failureCount < 3;
},
```

## Testing

使用 MSW mock API responses 進行測試：

- 驗證 PATCH 404 顯示「找不到該英雄，請再選擇其他英雄嘗試」
- 驗證 PATCH 400 顯示「輸入的值不正確，請確認後再次送出」
- 驗證 PATCH 500 顯示「儲存失敗，請重試」
- 驗證 GET query 收到 4xx 時不觸發重試
- 驗證 GET query 收到 5xx 時仍重試最多 3 次
