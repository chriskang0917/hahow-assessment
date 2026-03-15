## ADDED Requirements

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
