# Figma to Coda Pack - Development Guide

This comprehensive guide provides everything needed for developing and maintaining the Figma to Coda Pack.

## Table of Contents
- [Documentation Resources](#documentation-resources)
- [Local Development Setup](#local-development-setup)
- [Coda Pack Fundamentals](#coda-pack-fundamentals)
- [Common Development Patterns](#common-development-patterns)
- [Testing Strategies](#testing-strategies)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Documentation Resources

### Primary Documentation
- **Main Coda Packs Documentation**: https://coda.io/packs/build/latest/
- **API Reference**: https://coda.io/packs/build/latest/reference/sdk/
- **Community & Support**: https://community.coda.io/

### Essential Guides
- **Getting Started**: https://coda.io/packs/build/latest/guides/getting-started/
- **Pack Building Blocks**: https://coda.io/packs/build/latest/guides/blocks/
- **Authentication**: https://coda.io/packs/build/latest/guides/basics/authentication/
- **Error Handling**: https://coda.io/packs/build/latest/guides/advanced/errors/
- **Testing**: https://coda.io/packs/build/latest/guides/development/testing/

### Local SDK Reference
The `packs-sdk/` directory contains a complete copy of the @codahq/packs-sdk for offline reference:

#### Key Files for Development
- **`packs-sdk/dist/schema.d.ts`** - Schema type definitions and interfaces
- **`packs-sdk/dist/builder.d.ts`** - Pack building methods and configuration
- **`packs-sdk/dist/types.d.ts`** - Core SDK types and authentication
- **`packs-sdk/dist/api_types.d.ts`** - API request/response types
- **`packs-sdk/README.md`** - SDK overview

#### Sample Implementations
- **`packs-sdk/documentation/samples/packs/`** - Complete example packs
- **Useful examples**:
  - `apis/todoist.ts` - OAuth authentication patterns
  - `sync/notion.ts` - Sync table implementations
  - `formulas/weather.ts` - Formula and card patterns

## Local Development Setup

### Prerequisites
```bash
# Install Node.js 16+
node --version  # Should be 16+

# Install Coda CLI globally
npm install -g @codahq/packs-cli

# Verify installation
coda --version
```

### Development Commands
```bash
# Install dependencies
npm install

# Validate pack structure
npm run validate
# or: npx coda validate src/index.ts

# Build pack locally
npm run build
# or: npx coda build src/index.ts

# Test pack locally (requires auth setup)
npm run test
# or: npx coda execute src/index.ts FormuleName

# Upload to Coda
npm run upload
# or: npx coda upload src/index.ts --notes "Version notes"
```

### Authentication Setup for Local Testing
```bash
# Set up OAuth credentials for local testing
npx coda auth src/index.ts

# Follow the prompts to authenticate with Figma
# This creates local credentials for testing
```

## Coda Pack Fundamentals

### Pack Structure
```typescript
import * as coda from "@codahq/packs-sdk";

export const pack = coda.newPack();

// 1. Configure pack metadata
pack.addNetworkDomain("figma.com");

// 2. Set up authentication
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // ... OAuth configuration
});

// 3. Define schemas
const MySchema = coda.makeObjectSchema({
  properties: { /* ... */ },
  displayProperty: "name",
  idProperty: "id",
});

// 4. Add sync tables
pack.addSyncTable({
  name: "MyTable",
  schema: MySchema,
  identityName: "MyIdentity",
  formula: {
    name: "SyncMyTable",
    execute: async function([], context) {
      // Implementation
    }
  }
});

// 5. Add formulas
pack.addFormula({
  name: "MyFormula",
  execute: async function([], context) {
    // Implementation
  }
});

export default pack;
```

### Schema Best Practices
```typescript
const ComponentsSchema = coda.makeObjectSchema({
  properties: {
    key: { type: coda.ValueType.String, description: "Unique identifier" },
    name: { type: coda.ValueType.String, description: "Display name" },
    thumbnail_url: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
      description: "Thumbnail image"
    },
    created_at: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "Creation timestamp"
    },
    user: {
      type: coda.ValueType.Object,
      properties: {
        id: { type: coda.ValueType.String },
        handle: { type: coda.ValueType.String },
      }
    },
    link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      description: "Direct link to Figma"
    }
  },
  displayProperty: "name",
  idProperty: "key",
  featuredProperties: ["name", "thumbnail_url", "created_at", "user"],
  // For card formulas
  titleProperty: "name",
  subtitleProperties: ["user.handle"],
  imageProperty: "thumbnail_url",
  linkProperty: "link"
});
```

## Common Development Patterns

### Error Handling Pattern
```typescript
async function makeApiCall(context, url) {
  let response;
  try {
    response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
  } catch (error) {
    if (coda.StatusCodeError.isStatusCodeError(error)) {
      const statusError = error as coda.StatusCodeError;
      const message = statusError.body?.message || statusError.message;

      // Handle specific error codes
      if (statusError.statusCode === 403) {
        throw new coda.UserVisibleError(`Access denied: ${message}`);
      } else if (statusError.statusCode === 404) {
        throw new coda.UserVisibleError(`Resource not found: ${message}`);
      }

      throw new coda.UserVisibleError(`API error: ${message}`);
    }
    throw error; // Re-throw unexpected errors
  }
  return response;
}
```

### Pagination Pattern
```typescript
pack.addSyncTable({
  name: "Components",
  schema: ComponentsSchema,
  identityName: "Component",
  formula: {
    name: "SyncComponents",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "teamUrl",
        description: "Figma team URL"
      })
    ],
    execute: async function([teamUrl], context) {
      const teamId = extractTeamId(teamUrl);
      let allComponents = [];
      let cursor = undefined;

      do {
        const url = `https://api.figma.com/v1/teams/${teamId}/components`;
        const params = new URLSearchParams();
        if (cursor) params.append('cursor', cursor);

        const response = await makeApiCall(context, `${url}?${params}`);
        const components = response.body.meta?.components || [];

        allComponents.push(...components.map(formatComponent));
        cursor = response.body.cursor;

      } while (cursor);

      return {
        result: allComponents,
      };
    }
  }
});
```

### URL Parsing Pattern
```typescript
function parseFileUrl(url) {
  // Support both /file/ and /design/ formats
  const match = url.match(/\/(?:file|design)\/([a-zA-Z0-9]+)/);
  if (!match) {
    throw new coda.UserVisibleError("Invalid Figma file URL format");
  }
  return match[1];
}

function parseTeamUrl(url) {
  const match = url.match(/\/team\/(\d+)/);
  if (!match) {
    throw new coda.UserVisibleError("Invalid Figma team URL format");
  }
  return match[1];
}
```

### Card Formula Pattern
```typescript
pack.addFormula({
  name: "ComponentCard",
  description: "Get detailed component information",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "componentKey",
      description: "Component key from sync table"
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "sourceUrl",
      description: "File or team URL",
      optional: true
    })
  ],
  resultType: coda.ValueType.Object,
  schema: ComponentsSchema,
  execute: async function([componentKey, sourceUrl], context) {
    // Try file context first if URL provided
    if (sourceUrl && sourceUrl.includes('/file/')) {
      const fileKey = parseFileUrl(sourceUrl);
      const response = await makeApiCall(
        context,
        `https://api.figma.com/v1/files/${fileKey}/components`
      );

      const component = response.body.meta.components.find(c => c.key === componentKey);
      if (component) {
        return formatComponent(component);
      }
    }

    // Fall back to team search...
    throw new coda.UserVisibleError(`Component ${componentKey} not found`);
  }
});
```

## Testing Strategies

### Local Testing
```bash
# Test individual formulas
npx coda execute src/index.ts TestConnection

# Test with parameters
npx coda execute src/index.ts TestTeamAccess "https://figma.com/files/team/123"

# Test sync tables (requires parameters)
npx coda execute src/index.ts SyncTeamComponents "https://figma.com/files/team/123"
```

### Manual Testing Checklist
- [ ] OAuth flow works correctly
- [ ] All sync tables populate with real data
- [ ] Pagination works with large datasets (1000+ items)
- [ ] Error handling provides clear messages
- [ ] Card formulas display rich information
- [ ] URL parsing supports both `/file/` and `/design/` formats

### Production Testing
1. Upload pack to Coda workspace
2. Configure OAuth credentials
3. Test with real team/file URLs
4. Verify sync table performance
5. Test card formulas with actual keys

## Troubleshooting

### Common Issues

#### OAuth Problems
```
Error: OAuth2 authentication is required
```
**Solution**: Run `npx coda auth src/index.ts` to set up local credentials

#### API Rate Limiting
```
Error: 429 Too Many Requests
```
**Solution**: Implement exponential backoff or reduce request frequency

#### Invalid URLs
```
Error: Invalid team URL format
```
**Solution**: Check URL parsing regex patterns, support both old and new Figma URL formats

#### Schema Validation Errors
```
Error: Property 'xyz' is not defined in schema
```
**Solution**: Ensure all returned object properties are defined in schema

### Debugging Tips
1. **Use console.log()** - Coda CLI shows console output during execution
2. **Check API responses** - Log full response bodies to understand data structure
3. **Validate schemas** - Use `npm run validate` frequently during development
4. **Test incrementally** - Build and test one feature at a time

## Best Practices

### Code Organization
- Keep all code in `src/index.ts` until it exceeds ~1500 lines
- Group related schemas together
- Place sync tables after schemas
- Add formulas after sync tables
- Export pack at the end

### Performance
- Implement pagination for all API calls that support it
- Use cursor-based pagination when available
- Cache API responses when appropriate
- Minimize API calls in loops

### Error Handling
- Always wrap API calls in try-catch blocks
- Provide user-friendly error messages
- Handle specific HTTP status codes appropriately
- Include helpful guidance in error messages

### Documentation
- Add clear descriptions to all parameters and properties
- Use appropriate `codaType` hints (ImageReference, DateTime, Url)
- Include examples in parameter descriptions
- Document any limitations or requirements

### Security
- Never log sensitive information (API keys, tokens)
- Validate all user inputs
- Use appropriate OAuth scopes (minimal required permissions)
- Follow Figma API rate limiting guidelines

## Architecture Evolution

### Current: Single File (Phase 3)
- All code in `src/index.ts` (~1200 lines)
- Proven effective for current feature set
- Easy to debug and deploy

### Future: Modular Structure (Phase 4+)
Consider refactoring when approaching 1500+ lines:
```
src/
├── index.ts          # Pack exports and configuration
├── schemas/          # Schema definitions
├── sync-tables/      # Sync table implementations
├── formulas/         # Card and action formulas
├── auth/             # Authentication configuration
└── utils/            # Shared utilities
```

---

**Last Updated**: 2025-09-17
**Pack Version**: 10
**Phase**: 3 Complete