---
name: create-api
description: 建立 API 架構、生成 API endpoint。Generate API endpoints following the 4-layer Modern API Pattern (dto, api, transform, app) with TanStack Query hooks. Use when asked to create API, 新增 API, tableSSR, SSR table, or service layer files. Also use when the user asks to 建立 endpoint, 新增 service, 建 hook, 打 API, 串接 API, 接後端, 寫一個查詢/新增/修改/刪除的 API, create endpoint, add service layer, generate query hook, generate mutation hook, or build any backend integration with dto/api/transform/app files.
---

# Create API Skill

Generate API endpoints following the project's 4-layer Modern API Pattern documented in `CLAUDE.md` and `docs/FACTORY_ARCHITECTURE.md`.

## Usage Examples

```bash
# Basic query endpoint (GET)
/create-api feature=factory endpoint=factory-list method=GET

# Mutation endpoint (POST)
/create-api feature=product endpoint=create-product method=POST

# Update endpoint (PUT)
/create-api feature=workcenter endpoint=update-workcenter method=PUT

# Delete endpoint (DELETE)
/create-api feature=resource endpoint=delete-resource method=DELETE

# SSR Table endpoint (server-side paginated table)
/create-api feature=product endpoint=product-table type=ssr-table

# With transform layer
/create-api feature=factory endpoint=factory-options method=GET transform=select-options

# Skip transform layer
/create-api feature=order endpoint=order-detail method=GET transform=none
```

## Parameters

| Parameter | Required | Values | Description |
|-----------|----------|--------|-------------|
| `feature` | Yes | string | Feature domain name (e.g., `factory`, `product`, `workcenter`) |
| `endpoint` | Yes | string | Endpoint name in kebab-case (e.g., `factory-options`, `product-list`) |
| `method` | No | `GET`, `POST`, `PUT`, `DELETE` | HTTP method (default: `GET`) |
| `type` | No | `query`, `mutation`, `ssr-table` | Endpoint type (auto-detected from method if not specified) |
| `transform` | No | `select-options`, `list`, `custom`, `none` | Transform layer type (default: `none` for mutations, prompts for queries) |

## Generation Rules

### File Naming

| Layer | File Pattern | Location |
|-------|--------------|----------|
| DTO | `{endpoint}.dto.ts` | `src/features/{feature}/services/` |
| API | `{endpoint}.api.ts` | `src/features/{feature}/services/` |
| Transform | `{endpoint}.transform.ts` | `src/features/{feature}/services/` |
| App | `{endpoint}.app.ts` | `src/features/{feature}/services/` |
| Query Hook | `use-{endpoint}.ts` | `src/features/{feature}/hooks/` |
| Mutation Hook | `use-{action}-{entity}-mutation.ts` | `src/features/{feature}/hooks/` |

### Function Naming

| Layer | Pattern | Example |
|-------|---------|---------|
| API | `{endpointCamelCase}Api` | `factoryOptionsApi` |
| Transform | `transform{EndpointPascalCase}` | `transformFactoryOptions` |
| App (Query) | `get{EndpointPascalCase}` | `getFactoryOptions` |
| App (Create) | `create{EntityPascalCase}` | `createProduct` |
| App (Update) | `update{EntityPascalCase}` | `updateWorkcenter` |
| App (Delete) | `delete{EntityPascalCase}` | `deleteResource` |
| Hook (Query) | `use{EndpointPascalCase}` | `useFactoryOptions` |
| Hook (Mutation) | `use{Action}{Entity}Mutation` | `useCreateProductMutation` |

### Type Naming

| Type | Pattern | Example |
|------|---------|---------|
| Response | `{EndpointPascalCase}Response` | `FactoryOptionsResponse` |
| Payload | `{Action}{Entity}Payload` | `CreateProductPayload` |
| Entity | `{EntityPascalCase}` | `FactoryOption` |

## Decision Tree

```
Is this a server-side paginated table?
├── Yes → Use SSR Table pattern (extends SSRParams/SSRResponse)
└── No
    └── What HTTP method?
        ├── GET → Query pattern
        │   └── Need data transformation?
        │       ├── Yes → Include transform layer
        │       └── No → Skip transform layer
        └── POST/PUT/DELETE → Mutation pattern
            └── Skip transform layer (typically not needed)
```

## Output Files

For a query endpoint (`/create-api feature=factory endpoint=factory-options method=GET transform=select-options`):

```
src/features/factory/
├── hooks/
│   └── use-factory-options.ts       # TanStack useQuery hook
└── services/
    ├── factory-options.api.ts       # HTTP communication
    ├── factory-options.dto.ts       # TypeScript types
    ├── factory-options.transform.ts # Data transformation
    └── factory-options.app.ts       # Public interface
```

For a mutation endpoint (`/create-api feature=product endpoint=create-product method=POST`):

```
src/features/product/
├── hooks/
│   └── use-create-product-mutation.ts  # TanStack useMutation hook
└── services/
    ├── create-product.api.ts           # HTTP communication
    ├── create-product.dto.ts           # TypeScript types
    └── create-product.app.ts           # Public interface
```

## Implementation Checklist

When generating files, ensure:

- [ ] DTO types use snake_case to match backend
- [ ] API functions support `AbortSignal` for GET requests
- [ ] API functions use axios generics for response typing
- [ ] Transform functions are pure (no side effects)
- [ ] App layer is the only public interface for components
- [ ] Query hooks include proper `queryKey` with all dynamic params
- [ ] Query hooks pass `signal` from `queryFn` context
- [ ] Mutation hooks invalidate related queries on success
- [ ] Success/error messages use `App.useApp().message`
- [ ] All exports follow conventions (named for API/App, default for Transform/Hook)

## Code Templates

See `templates.md` in this directory for complete code templates for each layer.

## Related Documentation

- `CLAUDE.md` - Project conventions and API patterns
- `docs/FACTORY_ARCHITECTURE.md` - Detailed 4-layer pattern documentation
