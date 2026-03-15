### Requirement: Config SHALL reference design guide
The `context` block in `openspec/config.yaml` SHALL include a reference to `docs/DESIGN_GUIDE.md` as the UI design system authority (color, spacing, typography, component patterns).

#### Scenario: AI generates UI-related artifact
- **WHEN** AI creates an artifact involving UI components or styling
- **THEN** the context SHALL direct it to consult `docs/DESIGN_GUIDE.md` for design decisions

### Requirement: Config SHALL document routing conventions
The `context` block SHALL describe TanStack Router file-based routing patterns:
- Layout routes use `route.tsx`
- Dynamic params use `$paramName.tsx`
- `routeTree.gen.ts` is auto-generated and MUST NOT be manually edited

#### Scenario: AI generates a new route file
- **WHEN** AI creates an artifact that adds a new page or route
- **THEN** the artifact SHALL follow the layout route (`route.tsx`) and dynamic param (`$paramName.tsx`) naming patterns

#### Scenario: AI references route tree
- **WHEN** AI encounters `routeTree.gen.ts`
- **THEN** it SHALL treat the file as auto-generated and MUST NOT propose manual edits

### Requirement: Config SHALL document testing conventions
The `context` block SHALL describe testing file placement rules:
- Test files are co-located with source (`*.test.ts` in the same directory)
- MSW handlers are placed in the feature's `mocks/` directory

#### Scenario: AI generates a test file
- **WHEN** AI creates a test for `src/features/heroes/hooks/use-heroes.ts`
- **THEN** the test file SHALL be placed at `src/features/heroes/hooks/use-heroes.test.ts`

#### Scenario: AI generates an API mock handler
- **WHEN** AI creates MSW handlers for the heroes feature
- **THEN** the handlers SHALL be placed in `src/features/heroes/mocks/`

### Requirement: Config context SHALL include Makefile targets
The `context` block in `openspec/config.yaml` SHALL include an `Available Makefile targets` section listing the project's standard development commands and their purposes.

Required targets to document:
- `make dev` — 啟動開發伺服器
- `make format` — 程式碼格式化（Biome）
- `make lint` — 執行 lint 檢查（Biome）
- `make check` — 執行 Biome 全面檢查
- `make ci` — 執行 CI 檢查（Biome）
- `make ts-check` — TypeScript 型別檢查
- `make build` — Docker 建置

#### Scenario: AI generates a task involving code changes
- **WHEN** AI creates a task that involves writing or modifying source code
- **THEN** the context SHALL provide available Makefile targets so the task can reference appropriate verification commands

#### Scenario: AI references project tooling
- **WHEN** AI needs to suggest how to run, build, or verify the project
- **THEN** the context SHALL direct it to use Makefile targets instead of raw pnpm/npx commands

### Requirement: Config rules SHALL cover all artifact types
The `rules` block in `openspec/config.yaml` SHALL define rules for every artifact type in the schema: `proposal`, `design`, `specs`, and `tasks`.

#### Scenario: Config defines design rules
- **WHEN** AI generates a `design` artifact
- **THEN** the rules SHALL instruct it to use 繁體中文, focus on architecture decisions, and keep content concise

#### Scenario: Config defines specs rules
- **WHEN** AI generates a `specs` artifact
- **THEN** the rules SHALL instruct it to use Given-When-Then scenario format and ensure every requirement is verifiable

### Requirement: Tasks rules SHALL require verification steps
The `tasks` rules in `openspec/config.yaml` SHALL require each task to include a verification method referencing appropriate Makefile targets.

#### Scenario: AI generates a task with code changes
- **WHEN** AI creates a task that modifies TypeScript source code
- **THEN** the task SHALL include `make check` and `make ts-check` as verification steps

#### Scenario: AI generates a task with UI changes
- **WHEN** AI creates a task that modifies UI components or styling
- **THEN** the task SHALL include `make dev` for visual verification in addition to lint/type checks
