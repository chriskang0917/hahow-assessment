# API Code Templates

Reference templates for the 4-layer Modern API Pattern.

## Table of Contents

1. [DTO Layer Templates](#dto-layer-templates)
2. [API Layer Templates](#api-layer-templates)
3. [Transform Layer Templates](#transform-layer-templates)
4. [Application Layer Templates](#application-layer-templates)
5. [Hook Layer Templates](#hook-layer-templates)
6. [SSR Table Pattern](#ssr-table-pattern)

---

## DTO Layer Templates

### Single Entity Response

```typescript
// {endpoint}.dto.ts
export interface {Entity} {
  id: number;
  name: string;
  // Add fields matching backend response (use snake_case)
}

export interface {Entity}Response {
  data: {Entity};
}
```

### List Response

```typescript
// {endpoint}.dto.ts
export interface {Entity} {
  id: number;
  name: string;
}

export interface {Entity}ListResponse {
  data: {Entity}[];
}
```

### SSR Table Response (Paginated)

```typescript
// {endpoint}.dto.ts
import type { SSRParams, SSRResponse } from "@/hooks/useTableSSR";

export type {Entity}TablePayload = SSRParams;

export interface {Entity}TableResponse extends SSRResponse {
  data: {Entity}[];
}

export interface {Entity} {
  id: number;
  name: string;
  // ... other fields
}
```

### Create/Update Payload

```typescript
// {endpoint}.dto.ts
export interface Create{Entity}Payload {
  name: string;
  description?: string;
  // Required and optional fields for creation
}

export interface Update{Entity}Payload {
  id: number;
  name?: string;
  description?: string;
  // ID is required, other fields optional for partial updates
}
```

### Delete Payload (Query Params)

```typescript
// {endpoint}.dto.ts
export interface Delete{Entity}Payload {
  id: number;
  // Additional identifying fields if needed
}
```

### Payload with AbortSignal

```typescript
// {endpoint}.dto.ts
export interface {Entity}Payload {
  id: number;
  filter?: string;
  signal: AbortSignal | undefined;
}
```

---

## API Layer Templates

### GET with AbortSignal

```typescript
// {endpoint}.api.ts
import axiosInstance from "@/utils/axios";
import type { {Entity}Response } from "./{endpoint}.dto";

/**
 * Data Access Object
 * Responsible for fetching and updating data from the backend
 */

const END_POINT = "/api/{resource}";

export const {endpoint}Api = async (signal: AbortSignal | undefined) => {
  return axiosInstance.get<{Entity}Response>(END_POINT, { signal });
};
```

### GET with Path Parameter

```typescript
// {endpoint}.api.ts
import axiosInstance from "@/utils/axios";
import type { {Entity}Response } from "./{endpoint}.dto";

/**
 * Data Access Object
 * Responsible for fetching and updating data from the backend
 */

const END_POINT = "/api/{resource}";

export const {endpoint}Api = async (
  id: number,
  signal: AbortSignal | undefined
) => {
  return axiosInstance.get<{Entity}Response>(`${END_POINT}/${id}`, { signal });
};
```

### POST with Payload

```typescript
// {endpoint}.api.ts
import axiosInstance from "@/utils/axios";
import type { Create{Entity}Payload, {Entity}Response } from "./{endpoint}.dto";

/**
 * Data Access Object
 * Responsible for fetching and updating data from the backend
 */

const END_POINT = "/api/{resource}";

export const create{Entity}Api = async (payload: Create{Entity}Payload) => {
  return axiosInstance.post<{Entity}Response>(END_POINT, payload);
};
```

### POST with Payload and Signal

```typescript
// {endpoint}.api.ts
import axiosInstance from "@/utils/axios";
import type { {Entity}Payload, {Entity}Response } from "./{endpoint}.dto";

/**
 * Data Access Object
 * Responsible for fetching and updating data from the backend
 */

const END_POINT = "/api/{resource}";

export const {endpoint}Api = async ({
  signal,
  ...payload
}: {Entity}Payload) => {
  return axiosInstance.post<{Entity}Response>(END_POINT, payload, { signal });
};
```

### PUT for Updates

```typescript
// {endpoint}.api.ts
import axiosInstance from "@/utils/axios";
import type { Update{Entity}Payload } from "./{endpoint}.dto";

/**
 * Data Access Object
 * Responsible for fetching and updating data from the backend
 */

const END_POINT = "/api/{resource}";

export const update{Entity}Api = async (payload: Update{Entity}Payload) => {
  return axiosInstance.put(END_POINT, payload);
};
```

### DELETE with Query Params

```typescript
// {endpoint}.api.ts
import axiosInstance from "@/utils/axios";
import type { Delete{Entity}Payload } from "./{endpoint}.dto";

/**
 * Data Access Object
 * Responsible for fetching and updating data from the backend
 */

const END_POINT = "/api/{resource}";

export const delete{Entity}Api = async (params: Delete{Entity}Payload) => {
  return axiosInstance.delete(END_POINT, { params });
};
```

---

## Transform Layer Templates

### SelectProps Transformation

```typescript
// {endpoint}.transform.ts
import type { SelectProps } from "antd";
import type { {Entity}ListResponse } from "./{endpoint}.dto";

const transform{Entity}Options = (
  data: {Entity}ListResponse
): SelectProps["options"] => {
  return data.data.map((item) => ({
    label: item.name,
    value: item.id,
  }));
};

export default transform{Entity}Options;
```

### List Transformation (snake_case to camelCase)

```typescript
// {endpoint}.transform.ts
import type { {Entity}ListResponse } from "./{endpoint}.dto";

interface {Entity}UI {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const transform{Entity}List = (data: {Entity}ListResponse): {Entity}UI[] => {
  return data.data.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  }));
};

export default transform{Entity}List;
```

### Single Entity Transformation

```typescript
// {endpoint}.transform.ts
import type { {Entity}Response } from "./{endpoint}.dto";

interface {Entity}UI {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
}

const transform{Entity} = (data: {Entity}Response): {Entity}UI => {
  return {
    id: data.data.id,
    name: data.data.name,
    description: data.data.description ?? "",
    createdAt: new Date(data.data.created_at),
  };
};

export default transform{Entity};
```

---

## Application Layer Templates

### Query Function (GET)

```typescript
// {endpoint}.app.ts
import { {endpoint}Api } from "./{endpoint}.api";
import transform{Entity} from "./{endpoint}.transform";

/**
 * Application layer
 * Responsible for transforming data from the interface layer
 * into data required by the backend
 */

export const get{Entity} = async (signal: AbortSignal | undefined) => {
  const response = await {endpoint}Api(signal);
  return transform{Entity}(response.data);
};
```

### Query Function with Parameters

```typescript
// {endpoint}.app.ts
import { {endpoint}Api } from "./{endpoint}.api";
import transform{Entity} from "./{endpoint}.transform";

/**
 * Application layer
 * Responsible for transforming data from the interface layer
 * into data required by the backend
 */

export const get{Entity} = async (
  id: number,
  signal: AbortSignal | undefined
) => {
  const response = await {endpoint}Api(id, signal);
  return transform{Entity}(response.data);
};
```

### Query Function (No Transform)

```typescript
// {endpoint}.app.ts
import { {endpoint}Api } from "./{endpoint}.api";

/**
 * Application layer
 * Responsible for transforming data from the interface layer
 * into data required by the backend
 */

export const get{Entity} = async (signal: AbortSignal | undefined) => {
  const response = await {endpoint}Api(signal);
  return response.data;
};
```

### Create Function (POST)

```typescript
// {endpoint}.app.ts
import { create{Entity}Api } from "./{endpoint}.api";
import type { Create{Entity}Payload } from "./{endpoint}.dto";

/**
 * Application layer
 * Responsible for transforming data from the interface layer
 * into data required by the backend
 */

export const create{Entity} = async (payload: Create{Entity}Payload) => {
  const response = await create{Entity}Api(payload);
  return response.data;
};
```

### Update Function (PUT)

```typescript
// {endpoint}.app.ts
import { update{Entity}Api } from "./{endpoint}.api";
import type { Update{Entity}Payload } from "./{endpoint}.dto";

/**
 * Application layer
 * Responsible for transforming data from the interface layer
 * into data required by the backend
 */

export const update{Entity} = async (payload: Update{Entity}Payload) => {
  const response = await update{Entity}Api(payload);
  return response.data;
};
```

### Delete Function (DELETE)

```typescript
// {endpoint}.app.ts
import { delete{Entity}Api } from "./{endpoint}.api";
import type { Delete{Entity}Payload } from "./{endpoint}.dto";

/**
 * Application layer
 * Responsible for transforming data from the interface layer
 * into data required by the backend
 */

export const delete{Entity} = async (params: Delete{Entity}Payload) => {
  return await delete{Entity}Api(params);
};
```

---

## Hook Layer Templates

### Basic Query Hook

```typescript
// use-{endpoint}.ts
import { useQuery } from "@tanstack/react-query";
import { get{Entity} } from "@/features/{feature}/services/{endpoint}.app";

const use{Entity} = () => {
  return useQuery({
    queryKey: ["{feature}", "{endpoint}"],
    queryFn: ({ signal }) => get{Entity}(signal),
  });
};

export default use{Entity};
```

### Query Hook with Parameters

```typescript
// use-{endpoint}.ts
import { useQuery } from "@tanstack/react-query";
import { get{Entity} } from "@/features/{feature}/services/{endpoint}.app";

interface Use{Entity}Props {
  id: number | undefined;
}

const use{Entity} = ({ id }: Use{Entity}Props) => {
  return useQuery({
    queryKey: ["{feature}", "{endpoint}", id],
    queryFn: ({ signal }) => get{Entity}(id!, signal),
    enabled: !!id,
  });
};

export default use{Entity};
```

### Query Hook with Multiple Parameters

```typescript
// use-{endpoint}.ts
import { useQuery } from "@tanstack/react-query";
import { get{Entity} } from "@/features/{feature}/services/{endpoint}.app";

interface Use{Entity}Props {
  id: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
}

const use{Entity} = ({ id, startDate, endDate }: Use{Entity}Props) => {
  return useQuery({
    queryKey: ["{feature}", "{endpoint}", id, startDate, endDate],
    queryFn: ({ signal }) =>
      get{Entity}({
        id: id!,
        start_date: startDate!,
        end_date: endDate!,
        signal,
      }),
    enabled: !!id && !!startDate && !!endDate,
  });
};

export default use{Entity};
```

### Create Mutation Hook

```typescript
// use-create-{entity}-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { create{Entity} } from "@/features/{feature}/services/{endpoint}.app";

const useCreate{Entity}Mutation = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationKey: ["{feature}", "create-{entity}"],
    mutationFn: create{Entity},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["{feature}"],
      });
      message.success("建立成功");
    },
    onError: () => {
      message.error("建立失敗");
    },
  });
};

export default useCreate{Entity}Mutation;
```

### Update Mutation Hook

```typescript
// use-update-{entity}-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { update{Entity} } from "@/features/{feature}/services/{endpoint}.app";

const useUpdate{Entity}Mutation = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationKey: ["{feature}", "update-{entity}"],
    mutationFn: update{Entity},
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["{feature}", "{endpoint}", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["{feature}", "list"],
      });
      message.success("更新成功");
    },
    onError: () => {
      message.error("更新失敗");
    },
  });
};

export default useUpdate{Entity}Mutation;
```

### Delete Mutation Hook

```typescript
// use-delete-{entity}-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { delete{Entity} } from "@/features/{feature}/services/{endpoint}.app";

const useDelete{Entity}Mutation = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationKey: ["{feature}", "delete-{entity}"],
    mutationFn: delete{Entity},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["{feature}"],
      });
      message.success("刪除成功");
    },
    onError: () => {
      message.error("刪除失敗");
    },
  });
};

export default useDelete{Entity}Mutation;
```

---

## SSR Table Pattern

### DTO

```typescript
// {entity}-table.dto.ts
import type { SSRParams, SSRResponse } from "@/hooks/useTableSSR";

export type {Entity}TablePayload = SSRParams;

export interface {Entity}TableResponse extends SSRResponse {
  data: {Entity}[];
}

export interface {Entity} {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}
```

### API

```typescript
// {entity}-table.api.ts
import axiosInstance from "@/utils/axios";
import type { {Entity}TablePayload, {Entity}TableResponse } from "./{entity}-table.dto";

/**
 * Data Access Object
 * Responsible for fetching and updating data from the backend
 */

const END_POINT = "/api/{resource}/table";

export const {entity}TableApi = async (payload: {Entity}TablePayload) => {
  return axiosInstance.post<{Entity}TableResponse>(END_POINT, payload);
};
```

### App

```typescript
// {entity}-table.app.ts
import { {entity}TableApi } from "./{entity}-table.api";
import type { {Entity}TablePayload } from "./{entity}-table.dto";

/**
 * Application layer
 * Responsible for transforming data from the interface layer
 * into data required by the backend
 */

export const get{Entity}Table = async (payload: {Entity}TablePayload) => {
  return await {entity}TableApi(payload);
};
```

### Hook (useTableSSR)

```typescript
// use-{entity}-table.ts
import { useMemo } from "react";
import { get{Entity}Table } from "@/features/{feature}/services/{entity}-table.app";
import useTableSSR from "@/hooks/useTableSSR";

const use{Entity}Table = () => {
  const ssr = useTableSSR({
    api: get{Entity}Table,
    customKey: "{entity}-table",
    globalFilterColumns: ["name", "status", "description"],
  });

  const dataSource = useMemo(
    () => ssr.apiState.data?.data.data || [],
    [ssr.apiState.data]
  );

  return {
    ssr,
    dataSource,
  };
};

export default use{Entity}Table;
```

---

## Usage in Components

### Query Usage

```typescript
import use{Entity} from "@/features/{feature}/hooks/use-{endpoint}";

const MyComponent = () => {
  const { data, isLoading, isError } = use{Entity}();

  if (isLoading) return <Spin />;
  if (isError) return <Alert type="error" message="載入失敗" />;

  return <div>{data?.name}</div>;
};
```

### Mutation Usage

```typescript
import useCreate{Entity}Mutation from "@/features/{feature}/hooks/use-create-{entity}-mutation";

const MyComponent = () => {
  const { mutateAsync: create{Entity}, isPending } = useCreate{Entity}Mutation();

  const handleSubmit = async (values: FormValues) => {
    await create{Entity}(values);
  };

  return (
    <Button onClick={handleSubmit} loading={isPending}>
      建立
    </Button>
  );
};
```

### SSR Table Usage

```typescript
import use{Entity}Table from "@/features/{feature}/hooks/use-{entity}-table";
import { Table } from "antd";

const MyTableComponent = () => {
  const { ssr, dataSource } = use{Entity}Table();

  return (
    <Table
      dataSource={dataSource}
      loading={ssr.apiState.isFetching}
      pagination={ssr.tablePagination}
      onChange={ssr.handleTableChange}
      columns={columns}
    />
  );
};
```
