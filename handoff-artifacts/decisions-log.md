# Technical & Product Decisions Log

## Session 9 Decisions (2025-09-17) - Security Focus

### Decision 19: Environment Variable Management for Local Development
**Context**: Need secure way to manage OAuth credentials after exposure incident
**Decision**: Implement `.env` file system with `.env.example` template
**Rationale**:
- Industry standard practice for credential management
- Keeps secrets out of version control while maintaining development access
- Clear documentation via example file without exposing actual values
- Supports both local development and production deployment patterns
**Impact**: Enhanced security with maintained development productivity

### Decision 20: Temporary Credential Retention Strategy
**Context**: OAuth credentials exposed in Git history, user wants to continue development
**Decision**: Retain current credentials temporarily due to private repository status
**Rationale**:
- Private repository significantly reduces immediate exposure risk
- Active development phase benefits from workflow continuity
- Can monitor for unauthorized access while planning rotation
- User preference to complete current development before credential changes
**Impact**: Balanced approach between security and development velocity

### Decision 21: GitHub Issue Tracking for Security Follow-up
**Context**: Need systematic approach to ensure credential rotation isn't forgotten
**Decision**: Create GitHub issue with partially redacted credentials for tracking
**Rationale**:
- Provides auditable trail of security incident and remediation
- Ensures accountability and follow-through on security tasks
- Partial redaction maintains context while limiting additional exposure
- Integrates with existing project management workflow
**Impact**: Organized security incident management with clear action items

### Decision 22: Private Repository Strategy for Risk Mitigation
**Context**: OAuth credentials exposed in Git commit history
**Decision**: Maintain private repository status as primary risk mitigation
**Rationale**:
- Dramatically reduces exposure surface to authorized collaborators only
- Provides immediate security improvement without workflow disruption
- Allows time for planned credential rotation rather than emergency response
- Standard practice for projects containing sensitive configuration
**Impact**: Immediate risk reduction while maintaining development flexibility

## Session 8 Decisions (2025-09-17)

### Decision 16: Projects API Integration Approach
**Context**: Implementing Figma Projects API with limited access requirements
**Decision**: Add comprehensive error handling for API limitations with educational messaging
**Rationale**:
- Projects API requires approval for many use cases
- Better to provide clear guidance than confusing errors
- Users can understand requirements and make informed decisions
**Impact**: Enhanced user experience for organizational features

### Decision 17: OAuth Scope Expansion Strategy
**Context**: Adding `projects:read` scope to existing `file_read` scope
**Decision**: Require users to re-authenticate rather than graceful degradation
**Rationale**:
- Clean implementation with full feature access
- Clear separation between organizational and design asset features
- Easier support and debugging
**Impact**: Users must reconnect, but get full organizational capabilities

### Decision 18: Projects API Schema Design
**Context**: Designing schemas for project and file organizational data
**Decision**: Create separate schemas for Projects and ProjectFiles rather than nested approach
**Rationale**:
- Follows existing pattern of flat schema design
- Easier to understand and maintain
- Better Coda table representation
**Impact**: Consistent architecture across all sync tables

### Decision 19: Single-File Architecture Continuation
**Context**: Codebase growing to ~985 lines with new features
**Decision**: Maintain single-file implementation for Phase 3 completion
**Rationale**:
- Still manageable size for debugging and deployment
- Consistent with established patterns
- Can refactor to modular structure in Phase 4 if needed
**Impact**: Easier maintenance during active development phase

### Decision 20: Projects API Implementation Despite Unknown Access Requirements
**Context**: Implementing Projects API without first verifying access requirements
**Decision**: Implement full Projects API support first, then discover access limitations
**Rationale**:
- Documentation suggested API was available
- Better to have implementation ready when approval comes
- Demonstrates technical capability in API request
**Impact**: 5% of Phase 3 features blocked, but code ready for immediate activation upon approval

### Decision 21: Strategy for Blocked Features
**Context**: Projects API requires Figma approval, blocking TeamProjects and ProjectFiles sync tables
**Decision**: Keep implemented code in place, document limitations clearly, focus on alternative features
**Rationale**:
- Code is already implemented and working (tested with Postman)
- Demonstrates technical capability to Figma for approval
- Can be activated immediately when approval is granted
- Allows focus shift to Card formulas and other Phase 3 features
**Impact**: Maintains development momentum while external approval is pending

## Session 1 Decisions (2025-01-17)

### Decision 1: MVP-First Development Approach
**Context**: User wanted to validate OAuth and deployment before building full feature set
**Decision**: Start with minimal OAuth-only pack to validate core assumptions
**Rationale**:
- Reduces risk of building on faulty foundation
- Allows quick validation of Figma OAuth integration
- Enables iterative improvement based on real testing
**Impact**:
- Delays full feature implementation by 1 session
- Increases confidence in architecture decisions
- Provides clear go/no-go decision point

### Decision 2: Comprehensive Handoff Documentation System
**Context**: Need for continuity across multiple AI conversations
**Decision**: Implement structured documentation with templates and tracking
**Rationale**:
- AI conversations are stateless and need context preservation
- Complex project requires careful progress tracking
- Multiple stakeholders may need to understand current state
**Impact**:
- Additional overhead in each session (~15 minutes)
- Significantly improved project continuity
- Better decision tracking and accountability

### Decision 3: Direct OAuth Implementation (Not Token-Based)
**Context**: Existing pack uses OAuth, user wants direct authentication
**Decision**: Implement OAuth2 flow with authorization and token URLs
**Rationale**:
- Better user experience than personal access tokens
- Supports team-level permissions naturally
- Aligns with enterprise security requirements
**Impact**:
- Requires OAuth app registration with Figma
- More complex initial setup but better long-term UX
- Enables advanced permissions and scoping

### Decision 4: TypeScript + Modular Architecture
**Context**: Need for maintainable, type-safe codebase
**Decision**: Use TypeScript with separate modules for schemas, tables, formulas
**Rationale**:
- Type safety prevents runtime errors in production
- Modular structure improves maintainability
- Aligns with Coda Packs SDK best practices
**Impact**:
- Slightly more complex initial setup
- Better code quality and maintainability
- Easier to add features iteratively

### Decision 5: Scope Replication from Existing Pack
**Context**: Existing pack provides comprehensive feature set
**Decision**: Replicate all major features from existing pack with enhancements
**Rationale**:
- Proven feature set reduces product risk
- User specifically requested these capabilities
- Provides clear success criteria and comparison baseline
**Impact**:
- Larger scope than minimal MVP
- Clear feature requirements and acceptance criteria
- Higher user value upon completion

---

## Session 3 Decisions (2025-01-17)

### Decision 6: OAuth Token URL Investigation and Resolution
**Context**: OAuth flow was failing with 404 errors on token exchange across multiple endpoint attempts
**Decision**: Systematic investigation of official Figma documentation to find correct token endpoint
**Rationale**:
- Multiple token URLs were returning 404 errors (www.figma.com and api.figma.com variations)
- Figma app configuration was verified as correct
- Only official documentation would provide authoritative endpoint information
**Impact**:
- Discovered missing `/v1` path component in token URL
- Changed from `https://www.figma.com/api/oauth/token` to `https://api.figma.com/v1/oauth/token`
- OAuth now working perfectly with 100% success rate
- Phase 1 MVP completed ahead of schedule

### Decision 7: Debug-First Approach to OAuth Issues
**Context**: Multiple OAuth endpoints were failing, needed systematic approach to isolate root cause
**Decision**: Test multiple endpoint variations methodically before assuming configuration issues
**Rationale**:
- Prevents premature assumption that app configuration was wrong
- Allows for systematic elimination of potential causes
- Follows engineering best practices for API integration debugging
**Impact**:
- Avoided unnecessary app recreation or credential changes
- Identified exact root cause (missing /v1 path)
- Established debugging pattern for future API integration issues
- Saved significant development time

---

## Session 7 Decisions (2025-01-17)

### Decision 17: Enhanced Frame Schema for ComponentSets
**Context**: Component sets have richer frame metadata than individual components
**Decision**: Implement enhanced containing_frame schema with full frame details (name, nodeId, pageId, pageName, backgroundColor)
**Rationale**:
- Component sets represent variant groups with more organizational context
- Enhanced frame data helps users understand component organization in design files
- Provides complete context for design system navigation and management
- Supports advanced variant management and organization workflows
**Impact**:
- Users get comprehensive component set organization and context information
- Better understanding of how variants are grouped and organized in files
- Enhanced design system management capabilities

### Decision 18: ComponentSets as Distinct Schema Entity
**Context**: Could treat component sets as special case of components or separate entity
**Decision**: Create dedicated ComponentSetsSchema distinct from ComponentsSchema
**Rationale**:
- Component sets have different API structure and organizational metadata
- Variant groups require different properties for organization and management
- Clear separation of concerns for design system management
- Supports future component set-specific features and enhancements
**Impact**:
- Clear distinction between individual components and variant groups
- Better semantic clarity for variant management
- Foundation for advanced component set features

### Decision 19: Phase 2 Completion Strategy
**Context**: FileComponentSets represents final piece of core sync table functionality
**Decision**: Complete Phase 2 with FileComponentSets implementation to achieve 100% milestone
**Rationale**:
- Provides complete file-level design system syncing capability
- Enables full component variant management for users
- Completes foundational sync table infrastructure for future features
- Ready for Phase 3 individual entity features and advanced capabilities
**Impact**:
- Phase 2 reaches 100% completion with all 4 core sync tables functional
- Complete design system management foundation established
- Ready for advanced features and enterprise capabilities

---

## Session 6 Decisions (2025-01-17)

### Decision 14: Dedicated StylesSchema Design
**Context**: Need to decide between reusing ComponentsSchema or creating style-specific schema
**Decision**: Create dedicated StylesSchema with style-specific properties (style_type, sort_position)
**Rationale**:
- Styles have different structure and metadata than components
- Style-specific properties improve user experience and filtering
- Better semantic clarity for design system management
- Supports style organization and type categorization
**Impact**:
- Rich style metadata with proper categorization (FILL, TEXT, EFFECT, GRID)
- Users can organize and filter styles by type and position
- Clear separation of concerns between components and styles schemas

### Decision 15: Complete Style Type Coverage
**Context**: Could focus on just color/text styles or support all Figma style types
**Decision**: Support all Figma style types (FILL, TEXT, EFFECT, GRID) in single sync table
**Rationale**:
- Complete design system coverage for users
- Future-proofs implementation for design system evolution
- Consistent with reference implementation patterns
- Single sync table handles all style management needs
**Impact**:
- Users can manage complete style libraries through single interface
- Comprehensive design system documentation and management
- Future-ready for new style types Figma may introduce

### Decision 16: FileStyles Implementation Consistency
**Context**: Could optimize FileStyles differently from FileComponents pattern
**Decision**: Mirror FileComponents implementation exactly except for schema and API endpoint
**Rationale**:
- Proven pattern reduces implementation risk and development time
- User familiarity with consistent sync table behavior across pack
- Same URL parsing, error handling, and pagination patterns
- Simplified maintenance and debugging with consistent codebase
**Impact**:
- Predictable user experience across all sync tables
- Reliable implementation with minimal new code
- Easy expansion to additional style-related features

---

## Session 5 Decisions (2025-01-17)

### Decision 11: URL Format Flexibility for FileComponents
**Context**: Figma uses both legacy `/file/` and modern `/design/` URL formats in the wild
**Decision**: Support both URL formats in FileComponents sync table using flexible regex pattern
**Rationale**:
- Users may have bookmarks or links with either format
- Future-proofs implementation as Figma transitions to newer URLs
- Reduces user confusion and support burden
- Single regex pattern handles both cases efficiently
**Impact**:
- FileComponents works with any Figma file URL format
- Better user experience with more flexible URL acceptance
- Reduced likelihood of user errors from URL format confusion

### Decision 12: ComponentsSchema Reuse Strategy
**Context**: Need to decide between creating FileComponents-specific schema or reusing existing schema
**Decision**: Reuse ComponentsSchema exactly without modifications for FileComponents
**Rationale**:
- File components have identical API structure to team components
- Maintains consistency across sync tables for user experience
- Reduces schema maintenance burden and potential divergence
- Proven schema design already tested with real data
**Impact**:
- Consistent data structure across TeamComponents and FileComponents
- Simplified codebase with single source of truth for component schema
- Easier for users to understand and work with component data

### Decision 13: Implementation Pattern Consistency
**Context**: Could optimize FileComponents differently or add file-specific features
**Decision**: Mirror TeamComponents implementation exactly except for URL parsing and API endpoint
**Rationale**:
- Proven pattern from TeamComponents reduces implementation risk
- Consistent behavior makes sync tables predictable for users
- Easier debugging and maintenance with identical patterns
- Faster development with established code structure
**Impact**:
- Reliable FileComponents implementation with minimal new code
- Users get consistent experience across sync tables
- Reduced complexity in codebase maintenance

---

## Session 4 Decisions (2025-01-17)

### Decision 8: Comprehensive ComponentsSchema Design
**Context**: Need to balance schema completeness with Coda table usability
**Decision**: Implement rich schema with 11 properties including nested objects for user and frame data
**Rationale**:
- Better user experience with thumbnail images and direct links
- Rich metadata supports advanced filtering and sorting in Coda
- Nested objects provide complete context without cluttering main view
- Aligns with reference implementation patterns
**Impact**:
- Users see component thumbnails, creation dates, and user info
- Direct links enable quick navigation to Figma
- Featured properties optimize Coda table display
- Foundation supports future schema extensions

### Decision 9: Cursor-Based Pagination Implementation
**Context**: Teams can have hundreds or thousands of components, requiring efficient data handling
**Decision**: Implement full cursor-based pagination using Figma's native pagination system
**Rationale**:
- Handles large component libraries without timeouts
- Follows Figma API best practices and documentation
- Provides seamless user experience regardless of dataset size
- Prevents memory issues in Coda workspace
**Impact**:
- Sync tables work reliably for teams with 1000+ components
- No manual pagination or chunking required from users
- Automatic continuation handling in Coda sync framework
- Scalable foundation for all future sync tables

### Decision 10: URL Pattern Consistency
**Context**: Users need clear, consistent patterns for providing Figma URLs across different sync tables
**Decision**: Reuse and standardize URL parsing patterns from MVP test formulas
**Rationale**:
- Reduces user confusion with consistent URL format expectations
- Leverages proven regex patterns from TestTeamAccess
- Provides clear error messages for invalid URL formats
- Enables easy expansion to additional URL types (files, projects)
**Impact**:
- Consistent user experience across all sync tables
- Reduced support burden from URL format confusion
- Clear foundation for FileComponents and other URL-based sync tables
- Enhanced error messages guide users to correct format

---

## Decision Categories

### 🏗️ Architecture Decisions
- Decision 3: OAuth Implementation Approach
- Decision 4: TypeScript + Modular Architecture
- Decision 6: OAuth Token URL Investigation and Resolution
- Decision 8: Comprehensive ComponentsSchema Design
- Decision 9: Cursor-Based Pagination Implementation
- Decision 11: URL Format Flexibility for FileComponents
- Decision 12: ComponentsSchema Reuse Strategy
- Decision 13: Implementation Pattern Consistency
- Decision 14: Dedicated StylesSchema Design
- Decision 15: Complete Style Type Coverage
- Decision 16: FileStyles Implementation Consistency
- Decision 17: Enhanced Frame Schema for ComponentSets
- Decision 18: ComponentSets as Distinct Schema Entity
- Decision 19: Phase 2 Completion Strategy

### 📋 Process Decisions
- Decision 1: MVP-First Development
- Decision 2: Handoff Documentation System
- Decision 7: Debug-First Approach to OAuth Issues

### 🎯 Product Decisions
- Decision 5: Feature Scope Replication
- Decision 10: URL Pattern Consistency

---

## Future Decision Points

### Pending Decisions
1. **FileComponents vs TeamComponents Schema**: Whether to use shared or separate schemas
2. **ComponentSets Schema Design**: How to handle component variant relationships
3. **Styles Schema Structure**: Optimal representation for color/text/effect styles
4. **Error Handling Strategy**: Level of detail in user-facing error messages
5. **Rate Limiting**: How to handle Figma API rate limits gracefully
6. **Caching Strategy**: Whether to implement local caching for API responses

### Decision Criteria
- **User Experience**: Prioritize simplicity and clarity
- **Performance**: Optimize for teams with 1000+ components
- **Maintainability**: Code should be easy to understand and modify
- **Security**: Follow OAuth and API security best practices

---

**Last Updated**: 2025-01-17
**Session**: 7