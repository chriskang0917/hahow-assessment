# react-template 專案架構說明

## 📋 目錄

1. [技術棧](#️-技術棧)
2. [專案結構](#-專案結構)
3. [API 架構設計](#️-api-架構設計)
4. [狀態管理](#-狀態管理)
5. [路由架構](#-路由架構)
6. [撰寫風格指南](#️-撰寫風格指南)
7. [開發工具與配置](#️-開發工具與配置)
8. [測試策略](#-測試策略)
9. [架構建議](#-架構建議)
10. [版本紀錄](#-版本記錄)

---

## 🛠️ 技術棧

### 核心框架

- **React 19** - 主要前端框架
- **TypeScript** - 型別安全的開發語言
- **Vite** - 現代化構建工具

### UI 與樣式

- **TailwindCSS 4.1** - CSS 框架，使用 Vite 插件
- **Shadcn UI** - 高度客製化 UI 元件庫
- **Lucide React** - 圖標庫
- **Class Variance Authority (CVA)** - 元件變體管理

### 狀態管理

- **Zustand** - 輕量狀態管理
- **TanStack Query 5** - 服務端狀態管理
- **TanStack Table** - Headless Table 狀態管理
- **TanStack Form** - 表單狀態管理

### 路由

- **TanStack Router** - 型別安全的路由解決方案

### 工具與驗證

- **Zod** - 資料驗證與型別生成
- **Axios** - HTTP 客戶端

### 開發工具

- **MSW (Mock Service Worker)** - API Mocking
- **Vitest** - 測試框架
- **ESLint** - 程式碼檢查
- **Prettier** - 程式碼格式化
- **Sentry** - 錯誤監控

---

## 📁 專案結構

### 啟動專案

使用根目錄的 `app` 腳本來啟動專案：

#### 開發環境

```bash
./app dev
```

此指令會執行 `pnpm run dev` 啟動開發伺服器。

#### 生產環境建置

```bash
./app build
```

此指令會：

1. 切換到 main 分支並拉取最新代碼
2. 使用 Docker 建置前端應用程式
3. 在 8080 port 上運行容器

> **注意：** 確保 `app` 腳本有執行權限，如需要請先執行 `chmod +x app`

### 整體架構

```
src/
├── components/          # 共用 UI 元件
│   ├── common/         # 全域通用元件
│   ├── form/           # 表單相關元件
│   └── ui/             # 基礎 UI 元件 (Radix UI)
├── features/           # 功能模組化架構
│   ├── auth/           # 認證功能
│   ├── factory/        # 工廠功能
│   └── root/           # 根用戶功能
├── routes/             # 路由定義
├── lib/                # 核心工具庫
├── hooks/              # 全域共用 hooks
├── utils/              # 工具函數
├── types/              # 型別定義
├── constants/          # 常數定義
└── mocks/              # API Mock 數據
```

### Features 模組結構

每個 feature 模組採用 **按功能分層** 的架構：

```
features/auth/
├── components/         # 功能專用元件
├── hooks/              # 功能專用 hooks
├── services/           # 分層服務架構
│   ├── *.api.ts       # API 層 (Data Access)
│   ├── *.app.ts       # Application 層 (Business Logic)
│   ├── *.dto.ts       # Data Transfer Objects
│   └── *.transform.ts # 資料轉換層
├── store/              # 狀態管理
├── utils/              # 功能專用工具
├── schema/             # Zod 驗證 schema
└── mocks/              # 功能專用 mocks
```

---

## 🏗️ API 架構設計

### 分層架構模式

本專案採用 **三層架構** 模式：

#### 1. API 層 (Data Access Object)

```typescript
// login.api.ts
import axiosInstance from "@/lib/axios";
import type { LoginPayload, LoginResponse } from "./login.dto";

const END_POINT = "/api/auth/token/obtain";

export const loginApi = async (payload: LoginPayload) => {
  const response = await axiosInstance.post<LoginResponse>(END_POINT, payload);
  return response.data;
};
```

**職責：**

- 僅處理同一個 Endpoint 的 API 但同方法的請求，例如 GET、PUT、DELETE 等
- 最多僅用於拿到 API 的 Response

#### 2. Application 層 (Business Logic)

```typescript
// login.app.ts
import type { AuthToken } from "@/types/auth.type";
import { loginApi } from "./login.api";
import type { LoginPayload } from "./login.dto";
import { dtoToLoginToken } from "./login.transform";

export const login = async (payload: LoginPayload): Promise<AuthToken> => {
  const response = await loginApi(payload);
  return dtoToLoginToken(response);
};
```

**職責：**

- 執行業務邏輯
- 資料轉換與處理
- 串接多個 API 呼叫
- 錯誤處理與驗證

#### 3. 資料轉換層 (Transform)

```typescript
// login.transform.ts
import type { AuthToken } from "@/types/auth.type";
import type { LoginResponse } from "./login.dto";

export const dtoToLoginToken = (dto: LoginResponse): AuthToken => ({
  accessToken: dto.access,
  refreshToken: dto.refresh,
});
```

**職責：**

- 前後端資料格式轉換
- DTO 到 Domain Model 轉換
- 確保型別安全

#### 4. DTO 層（Data Transfer Object）

```typescript
// login.dto.ts
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string; // 後端使用 snake_case
  refresh: string;
  user: {
    id: string;
    email: string;
  };
}
```

**職責：**

- 定義與後端 API 經過 snake to camel 轉譯後對應的資料格式
- 僅用於 API 層與 Transform 層之間的資料傳輸

**型別放置規則：**

- DTO 型別：放在各 feature 的 `services/*.dto.ts` 中
- Domain 型別：經過 Transform 後的格式放在 `/src/types` 內
- 命名規範：`{domain}.type.ts`（如 `auth.type.ts`）
- 若 domain type 較多，可用資料夾分類，邏輯與 `features` 一致

```typescript
// /src/types/auth.type.ts (Domain 型別)
export interface AuthToken {
  accessToken: string; // 前端使用 camelCase
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  role: Role; // 經過轉換的枚舉值
}

export type Role = "root" | "factory" | "supplier";
```

### API 客戶端配置

```typescript
// lib/axios.ts
const axiosInstance = axios.create({ baseURL });

// 自動資料格式轉換 (camelCase ↔ snake_case)
axiosInstance.interceptors.request.use((config) => enhancedRequestSuccess(config));

// 自動 Token 刷新機制
axiosInstance.interceptors.response.use(
  (response) => enhancedSuccessResponse(response),
  (error) => enhancedErrorResponse(error),
);
```

**特性：**

- 自動 camelCase ↔ snake_case 來回轉換，型別請直接定義 camelCase
- JWT Token 自動刷新
- 統一錯誤處理
- 型別安全的響應

---

## 🔄 狀態管理

### Zustand 全域狀態

建議再封裝一層，避免某些如 `invalidateQueries` 或 `router.invalidate` 等函式暴露在各處。

例如 useAuthStore 可封裝為 useAuth，並將 invalidate 封裝至該 hook 中，後續僅從這個 hook 中獲取 Store 的相關邏輯，避免需要到處存取 router 或 useQuery 的邏輯。

```typescript
// useAuthStore.ts
const useAuthStoreBase = create<Auth & AuthStoreActions>((set, get) => ({
  // 狀態
  id: "",
  email: "",
  role: null,
  isLogin: false,

  // 動作
  initialize: () => {
    /* ... */
  },
  setMe: (me: User) => {
    /* ... */
  },
  login: () => {
    /* ... */
  },
  logout: () => {
    /* ... */
  },
}));

export const useAuthStore = createSelectors(useAuthStoreBase);
```

**使用模式：**

- 使用 `createSelectors` 提供細粒度狀態選擇
- 支援狀態重置機制
- 與 token 管理器整合

### TanStack Query 服務端狀態

```typescript
// useMeInfo.ts
export const useMeInfo = () => {
  const isLogin = useAuthStore.use.isLogin();
  return useQuery({
    queryKey: ["me"],
    queryFn: me,
    enabled: isLogin,
  });
};
```

**使用架構**
請記得每一個 Query 或 Mutation 都要以一個 hook 去包裹，不要直接在元件內使用，目的是為了將需要用到的 hook 或業務邏輯放到 hook 中，避免元件內碰到業務邏輯。

---

## 🚏 路由架構

### TanStack Router 設定

```typescript
// __root.tsx
type RouterContext = {
  auth: Auth;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
```

### 路由結構

```
routes/
├── __root.tsx              # 根路由
├── index.tsx               # 首頁
├── auth.tsx                # 認證佈局
├── auth/
│   ├── login.tsx           # 登入頁
│   └── forgot-password.tsx # 忘記密碼頁
├── _protected.tsx          # 受保護路由佈局
└── _protected/
    ├── root/
```

**特性：**

- 型別安全的路由定義
- 自動程式碼分割
- 路由級認證保護
- 巢狀佈局支援

---

## ✍️ 撰寫風格指南

### 檔案命名規範

```
// 檔案命名採用 kebab-case
user-profile.tsx
login-form.tsx
api-client.ts

// 資料夾命名採用 kebab-case
user-management/
auth-service/
```

### 元件撰寫模式

所有元件建議皆以 arrow function 進行撰寫，除了：

- 僅在 router page 中為了維持 page 在 create file router 後取用，可使用 function 來撰寫。
- 在部分 ui 元件，原本設計為 function 的可不進行轉換。

```typescript
// 使用函數式元件 + TypeScript
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

const LoginForm = ({ title, onSubmit }: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
};

export default LoginForm;
```

### Import 順序與規範

```typescript
// 1. React 相關
import { useState, useEffect } from "react";

// 2. 第三方庫（按字母順序）
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 3. 內部模組（按字母順序）
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import type { User } from "@/types/auth.type";
```

**Import 規範：**

- React 相關 import 放在最前面
- 內部模組使用 `@/` 路徑別名，按字母順序
- Type import 使用 `type` 關鍵字
- 每個分組之間空一行

### Hook 封裝最佳實踐

```typescript
// ❌ 不好的做法 - 直接在元件中使用 store 和 router
const MyComponent = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    authStore.logout();
    queryClient.invalidateQueries();
    router.invalidate();
  };
};

// ✅ 好的做法 - 封裝成 hook
const useAuth = () => {
  const router = useRouter();
  const authStore = useAuthStore.use;
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    authStore.logout();
    queryClient.invalidateQueries();
    router.invalidate();
  }, [authStore, queryClient, router]);

  return {
    user: authStore.user(),
    isLogin: authStore.isLogin(),
    logout,
  };
};

// 元件中使用
const MyComponent = () => {
  const { user, isLogin, logout } = useAuth();

  return <Button onClick={logout}>登出</Button>;
};
```

### 錯誤處理模式

錯誤處理已在 `axios.ts` 的 interceptor 中截斷處理，因此正常接會接收到後端的錯誤碼與狀態，並由 React Query 去做後續的狀態管理。

```typescript
// API 層錯誤處理
/**
   *  If the request is unauthorized, try to refresh the token
   *  If the refresh token is invalid, logout the user
   */
  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      ...
    } catch (refreshError) {
      ...
    }
  }

  /**
   *  If the request is forbidden, logout the user
   */
  if (error.response?.status === 403) {
    authStore.logout();
    return Promise.reject({ ...error.response, ok });
  }

  if (error.response) return Promise.reject({ ...error.response, ok });
}

// UI 層錯誤處理使用 TanStack Query
const { data, error, isError } = useQuery({
  queryKey: ["data"],
  queryFn: fetchData,
});

if (isError) {
  return <ErrorComponent error={error} />;
}
```

---

## ⚙️ 開發工具與配置

### Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    sentryVitePlugin(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

### ESLint 配置

- TypeScript 嚴格模式
- React Hooks 規則
- TanStack Query 規則
- 自動匯入排序

### Prettier 配置

- TailwindCSS 類名排序
- 一致的程式碼格式

---

## 🧪 測試策略

### 測試工具

- **Vitest** - 單元測試與整合測試
- **MSW** - API Mock 測試

### 測試檔案組織

```
src/
├── features/auth/
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── jwt.test.ts      # 與源文件同目錄
└── utils/
    ├── case-transform.ts
    └── case-transform.test.ts
```

### Mock 策略

```typescript
// mocks/auth-handlers.ts
export const authHandlers = [
  http.post("/api/auth/token/obtain", () => {
    return HttpResponse.json({ access: "token", refresh: "refresh" });
  }),
];
```

---

## 💡 架構建議

### 🔍 未來建議

1. **測試覆蓋率** - 建議增加更多元件和整合測試
2. **Bundle 分析** - 定期分析 bundle 大小優化

### 📝 開發最佳實踐

1. **新增 Feature 時**：依照既有模組結構創建
2. **API 開發**：遵循三層架構模式
3. **狀態管理**：優先使用 TanStack Query，全域狀態使用 Zustand
4. **樣式開發**：參考 `DESIGN_GUIDE.md` 設計規範
5. **型別定義**：集中在 `types/` 目錄管理

---

## 🔄 版本記錄

- **v1.0** (2025-07-02) - 初始專案架構文件

  - 建立完整的技術棧說明
  - 定義 Features 模組化架構
  - 建立 API 三層架構設計
  - 制定程式碼撰寫風格指南
  - 修正 Shadcn UI 技術棧說明
  - 新增 TanStack Table 狀態管理
  - 優化 API 四層架構（API/App/Transform/DTO）
  - 明確定義 DTO 層經過 snake_to_camel 轉譯的職責
  - 新增 Role 型別定義（root/factory/supplier）
  - 完善元件撰寫模式規範（統一 arrow function）
  - 更新錯誤處理策略（基於 axios interceptor）
  - 新增 Hook 封裝最佳實踐範例
  - 簡化架構建議，聚焦核心改進項目

---

_此文件會隨著專案發展持續更新，建議開發團隊定期檢視並改進架構設計。_
