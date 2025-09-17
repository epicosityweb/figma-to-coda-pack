# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Coda Pack Commands
- `npm run build` - Build the pack using Coda CLI (creates bundle for deployment)
- `npm run validate` - Validate pack structure and syntax using `npx coda validate src/index.ts`
- `npm run test` - Execute pack locally for testing (`npx coda execute`)
- `npm run dev` - Compile TypeScript and validate (combined workflow)
- `npm run upload` - Upload to Coda (requires pack ID configuration in package.json)
- `npm run watch` - Watch mode for continuous testing during development

### TypeScript Development
- `npm run compile` - Compile TypeScript without Coda validation
- Note: Direct `tsc` compilation may show SDK type warnings, but Coda CLI tools work correctly

## Architecture Overview

### Project Structure Philosophy
This is a **session-based development project** with structured AI conversation handoffs:

- **`handoff-artifacts/`** - Contains session documentation, progress tracking, and decision logs
- **`docs/PRD.md`** - Complete Product Requirements Document defining the full feature scope
- **`src/index.ts`** - Single-file MVP pack implementation (will expand to modular structure)

### Current Development Phase
**Phase 3: Complete Feature Set (100% complete)**
- OAuth2 authentication fully working and deployed (Pack ID: 44800, Version 10)
- Six production sync tables: TeamProjects, ProjectFiles, TeamComponents, FileComponents, FileStyles, FileComponentSets
- Three card formulas: ComponentCard, StyleCard, ComponentSetCard
- Comprehensive schemas for organizational structure and design assets
- Test formulas: `TestConnection()` and `TestTeamAccess()`
- Projects API integration with `projects:read` scope
- Pagination support for large datasets
- Flexible URL parsing for both /file/ and /design/ formats
- Rich card displays with thumbnails, metadata, and direct Figma links

### Current Architecture
**Single-file implementation** in `src/index.ts` (~1200 lines):
- All schemas, sync tables, and formulas in one file
- Proven to work well for current feature set
- May evolve to modular structure in future phases

### Key Figma API Integration Points
- **OAuth Endpoints**: Authorization at `https://www.figma.com/oauth`, token at `https://api.figma.com/v1/oauth/token`
- **OAuth Scopes**: `file_read`, `projects:read` ✅ Configured
- **User Info**: `/v1/me` endpoint for connection names ✅ Implemented

#### Organizational Structure (⚠️ Requires API Approval)
- **Team Projects**: `/v1/teams/{team_id}/projects` ⚠️ Implemented (blocked by API approval)
- **Project Files**: `/v1/projects/{project_id}/files` ⚠️ Implemented (blocked by API approval)

#### Design Assets
- **Team Components**: `/v1/teams/{team_id}/components` (with pagination) ✅ Implemented
- **File Components**: `/v1/files/{file_key}/components` (with pagination) ✅ Implemented
- **File Styles**: `/v1/files/{file_key}/styles` (with pagination) ✅ Implemented
- **File Component Sets**: `/v1/files/{file_key}/component_sets` (with pagination) ✅ Implemented

#### Enterprise Features (Planned)
- **Variables**: `/v1/files/{file_key}/variables/local` (Enterprise only) ⏳ Planned

## AI Session Workflow

### Before Starting Work
1. Read `handoff-artifacts/session-XXX-[latest-date].md` for current state
2. Review `handoff-artifacts/progress-tracker.md` for phase status
3. Check `handoff-artifacts/decisions-log.md` for technical decisions
4. Update TodoWrite based on documented next priorities

### During Development
1. Use TodoWrite tool to track progress within session
2. Document all code changes and decisions
3. Test changes with `npm run validate` before proceeding
4. Follow error handling patterns established in MVP (StatusCodeError handling)

### Before Ending Session
1. Create comprehensive session document in `handoff-artifacts/`
2. Update `progress-tracker.md` with current completion status
3. Add any architectural decisions to `decisions-log.md`
4. Set clear next session priorities

## Coda Pack Documentation & Resources

### Official Documentation
- **Main Documentation**: https://coda.io/packs/build/latest/
- **API Reference**: https://coda.io/packs/build/latest/reference/sdk/
- **Community & Support**: https://community.coda.io/

### Local SDK Reference (Downloaded)
The `packs-sdk/` directory contains a complete copy of the @codahq/packs-sdk for offline reference:
- **`packs-sdk/dist/`** - TypeScript definitions for all SDK classes, methods, and types
- **`packs-sdk/documentation/samples/`** - Example packs demonstrating various features
- **`packs-sdk/README.md`** - SDK overview and getting started guide

### Key Documentation Sections
- **Formulas**: https://coda.io/packs/build/latest/guides/blocks/formulas/
- **Sync Tables**: https://coda.io/packs/build/latest/guides/blocks/sync-tables/
- **Cards**: https://coda.io/packs/build/latest/guides/blocks/cards/
- **Actions**: https://coda.io/packs/build/latest/guides/blocks/actions/
- **Authentication**: https://coda.io/packs/build/latest/guides/basics/authentication/
- **Error Handling**: https://coda.io/packs/build/latest/guides/advanced/errors/
- **Testing**: https://coda.io/packs/build/latest/guides/development/testing/

### Local Development References
When implementing features, consult these local files:
- **Schema Types**: `packs-sdk/dist/schema.d.ts`
- **Pack Building**: `packs-sdk/dist/builder.d.ts`
- **Authentication Types**: `packs-sdk/dist/types.d.ts`
- **Sample Implementations**: `packs-sdk/documentation/samples/packs/`

## Coda Pack Development Specifics

### Pack Configuration
- Pack exports: `export const pack = coda.newPack()` and `export default pack`
- Network domain: `figma.com` is pre-configured
- OAuth2 authentication is fully configured but requires Figma OAuth app registration

### Schema Patterns (From Reference Implementation)
- Use `coda.makeObjectSchema()` with properties, displayProperty, idProperty
- Include `featuredProperties` for better Coda table display
- Add proper descriptions and hint types (ImageReference, DateTime, Url)

### Error Handling Pattern
```typescript
try {
  response = await context.fetcher.fetch({...});
} catch (error) {
  if (coda.StatusCodeError.isStatusCodeError(error)) {
    const statusError = error as coda.StatusCodeError;
    const message = statusError.body?.message || statusError.message;
    throw new coda.UserVisibleError(`User-friendly message: ${message}`);
  }
  throw error;
}
```

### Testing Formulas
- `TestConnection()` - Validates OAuth and returns user info
- `TestTeamAccess("team_url")` - Tests API access with team URL parsing

### Production Sync Tables
#### Organizational (⚠️ Requires Figma API Approval)
- **TeamProjects** - Sync all projects from a Figma team (BLOCKED - pending API approval)
- **ProjectFiles** - Sync all files from a specific project (BLOCKED - pending API approval)

#### Design Assets
- **TeamComponents** - Sync all components from a Figma team
- **FileComponents** - Sync all components from a specific file
- **FileStyles** - Sync all styles (text, color, effects, grids) from a file
- **FileComponentSets** - Sync all component sets (variant groups) from a file

### Schemas Implemented
#### Organizational
- **ProjectsSchema** - Project data with team ID, file count, timestamps
- **ProjectFilesSchema** - File data with thumbnails, project context, branch metadata

#### Design Assets
- **ComponentsSchema** - Full component data with thumbnails, user info, containing frames
- **StylesSchema** - Style data with type, thumbnails, sort position
- **ComponentSetsSchema** - Component set data with variant information

## Reference Implementation
The `Figma Design Integration - Source Code` file contains a complete implementation with all planned features. Use this as reference for:
- Schema definitions (UsersSchema, ComponentsSchema, StylesSchema, etc.)
- Sync table implementations with pagination
- URL parsing patterns for Figma team/file URLs
- Card formula implementations

## Deployment Status
**Pack is fully deployed and working:**
- ✅ OAuth application registered with Figma
- ✅ Pack uploaded to Coda (Pack ID: 44800, Version 10)
- ✅ OAuth credentials configured in both Figma and Coda
- ✅ All design asset sync tables tested with real data
- ✅ All card formulas implemented and deployed
- ✅ Pagination working for large datasets
- ✅ Rich card displays with thumbnails and metadata
- 🚫 **Projects API BLOCKED**: Requires approval from Figma (submitted 2025-09-17)
- ⏳ TeamProjects and ProjectFiles sync tables await API approval

## URL Format Support
The pack supports both current Figma URL formats:
- **Legacy**: `https://www.figma.com/file/ABC123/filename`
- **Current**: `https://www.figma.com/design/ABC123/filename`
- **Team URLs**: `https://www.figma.com/files/team/123456789`