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
