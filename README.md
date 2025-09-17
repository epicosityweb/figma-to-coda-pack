# Figma to Coda Pack

A comprehensive Coda Pack for syncing Figma design systems, components, styles, and variables directly to Coda with OAuth2 authentication.

## Current Status: MVP Phase

This pack is currently in MVP development phase, focused on validating OAuth2 authentication with Figma.

### MVP Features (v0.1.0)
- ✅ OAuth2 authentication with Figma
- ✅ Connection validation
- ✅ Basic user information retrieval
- ✅ Team access testing
- ⏳ Deployment validation (pending)

### Planned Features (Future Phases)
- Component synchronization (team and file level)
- Component sets and variants
- Design styles (text, color, effects)
- Figma variables and collections (Enterprise)
- Dev resources management
- Image export functionality

## Setup & Installation

### Prerequisites
- Node.js 16+ installed
- Coda CLI installed (`npm install -g @codahq/packs-cli`)
- Figma Teams account with admin access
- Coda workspace access

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the pack:**
   ```bash
   npm run build
   ```

3. **Validate the pack:**
   ```bash
   npm run validate
   ```

4. **Test locally:**
   ```bash
   npm run test
   ```

### OAuth Configuration

Before using this pack, you'll need to:

1. **Register OAuth App with Figma:**
   - Go to your Figma account settings
   - Create a new OAuth application
   - Set the redirect URL to your Coda pack's OAuth handler
   - Note the Client ID and Client Secret

2. **Configure Coda Pack:**
   - Upload the pack to Coda
   - Add your OAuth credentials in the pack settings
   - Test the authentication flow

## Testing the MVP

### Test Connection Formula
Use the `TestConnection()` formula to verify OAuth authentication:
- Returns your Figma user information
- Validates that the OAuth flow is working correctly

### Test Team Access Formula
Use `TestTeamAccess("YOUR_TEAM_URL")` to verify API access:
- Provide your Figma team URL
- Returns team ID and component count
- Validates API permissions

## Project Structure

```
figma-coda-pack/
├── docs/                  # Project documentation
│   └── PRD.md            # Product Requirements Document
├── handoff-artifacts/     # AI session documentation
│   ├── README.md         # Documentation guidelines
│   ├── progress-tracker.md
│   └── decisions-log.md
├── src/                   # Source code
│   └── index.ts          # Main pack implementation
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Development Workflow

### Session-Based Development
This project uses a structured session-based development approach with AI conversation handoffs:

1. Each session is documented in `handoff-artifacts/`
2. Progress is tracked in `progress-tracker.md`
3. Key decisions are logged in `decisions-log.md`
4. Clear next steps are defined for continuity

### Build Commands
- `npm run build` - Build the pack for deployment
- `npm run validate` - Validate pack structure and syntax
- `npm run dev` - Compile TypeScript and validate
- `npm run test` - Execute pack locally for testing
- `npm run upload` - Upload to Coda (requires pack ID configuration)

## Contributing

### For AI Assistants
1. Read the latest session documentation in `handoff-artifacts/`
2. Update your todo list based on documented priorities
3. Document all changes and decisions during the session
4. Create comprehensive handoff documentation before ending

### Code Style
- Use TypeScript with strict type checking
- Follow Coda Packs SDK best practices
- Implement comprehensive error handling
- Add JSDoc comments for all public functions

## Support & Documentation

- **Coda Packs SDK**: https://coda.io/packs/build
- **Figma API**: https://www.figma.com/developers/api
- **Project Documentation**: See `docs/` folder
- **Session History**: See `handoff-artifacts/` folder

## License

MIT License - see LICENSE file for details

---

**Version**: 0.1.0 (MVP)
**Last Updated**: 2025-01-17
**Status**: In Development