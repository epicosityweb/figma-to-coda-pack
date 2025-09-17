# Handoff Artifacts - AI Conversation Documentation

This directory contains structured documentation for each AI conversation session to ensure seamless handoffs and progress tracking.

## Documentation Structure

### File Naming Convention
- `session-XXX-YYYY-MM-DD.md` - Individual session summaries
- `progress-tracker.md` - Overall project progress overview
- `decisions-log.md` - Key technical and product decisions
- `code-changes-summary.md` - Cumulative code changes across sessions

### Session Template

Each session document should follow this structure:

```markdown
# Session [NUMBER] - [DATE]

## Session Goal
Brief description of what this session aimed to accomplish

## Participants
- AI Assistant: [Model version]
- Human: [Role/Name if applicable]

## Completed Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Code Changes
### Files Created
- `path/to/file.ts` - Description
- `path/to/file.md` - Description

### Files Modified
- `path/to/file.ts` - What was changed
- `path/to/file.json` - What was changed

### Files Deleted
- `path/to/file.ts` - Reason for deletion

## Key Decisions Made
1. **Decision**: Description
   - **Rationale**: Why this decision was made
   - **Impact**: What this affects going forward

## Testing Results
### What was tested
- Feature/functionality tested
- Results/outcomes

### Issues discovered
- Issue description
- Severity level
- Proposed resolution

## Known Issues
- Issue 1: Description and current status
- Issue 2: Description and current status

## Next Session Priorities
1. High priority item
2. Medium priority item
3. Low priority item

## Important Context for Next AI
### Critical information to remember
- Key context that the next AI session needs to know
- Important constraints or requirements
- Specific user preferences or requirements

### Current state summary
- Where we left off
- What's working
- What needs attention

## Additional Notes
Any other relevant information, links, or context
```

## Guidelines for AI Assistants

### Before Starting Work
1. Read the latest session document to understand current state
2. Review `progress-tracker.md` for overall project status
3. Check `decisions-log.md` for key technical decisions
4. Update your todo list based on documented next priorities

### During the Session
1. Document decisions as they're made
2. Note any deviations from planned approach
3. Track all code changes with brief descriptions
4. Record any testing performed and results

### Before Ending Session
1. Create a comprehensive session document
2. Update `progress-tracker.md` with current status
3. Add any new decisions to `decisions-log.md`
4. Set clear priorities for next session

## Best Practices

### Documentation Quality
- Be specific and actionable in task descriptions
- Include enough context for the next AI to understand decisions
- Document both successes and failures/blockers
- Include relevant code snippets or error messages

### Consistency
- Always use the same template structure
- Maintain consistent file naming
- Update all relevant tracking documents each session
- Cross-reference related decisions and changes

### Handoff Efficiency
- Prioritize critical information that affects next steps
- Clearly separate completed work from work in progress
- Highlight any blocking issues or dependencies
- Provide clear guidance on where to continue

## Progress Tracking

The `progress-tracker.md` file should be updated each session to reflect:
- Overall project completion percentage
- Phase completion status
- Key milestones achieved
- Upcoming milestones and deadlines
- Any scope changes or adjustments

This structured approach ensures continuity across AI conversations and maintains project momentum regardless of session boundaries.