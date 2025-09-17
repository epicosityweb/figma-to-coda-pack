# Next Session Plan: Component-Aware Dev Resource Creation

**Priority**: High
**Estimated Duration**: 2-3 hours
**Target Completion**: Session 11
**Pack Version Target**: Version 14

## 🎯 Objective

Enable users to create dev resources directly from component context in Coda, eliminating the need to manually specify file_key and node_id parameters.

## 🔍 Current State Recap

### ✅ What's Working
- **Version 13 Deployed**: Two-way sync for editing existing dev resources
- **Table Relationships**: Bi-directional linking between components and dev resources
- **Complete CRUD**: All dev resource operations work (Create, Read, Update, Delete)
- **Bulk Operations**: Efficient batch creation and updates

### 🎯 What's Missing
Users still need to manually provide file_key and node_id when creating dev resources. We want to simplify this to just provide the component and let the system figure out the rest.

## 📋 Implementation Plan

### Phase 1: AddDevResourceToComponent Action Formula (45 mins)

**Objective**: Create dev resources with component context
**Implementation**:
```typescript
pack.addFormula({
  name: "AddDevResourceToComponent",
  description: "Create a dev resource linked to a specific component",
  isAction: true,
  parameters: [
    {
      type: coda.ParameterType.String,
      name: "componentKey",
      description: "The component key (from FileComponents table)",
    },
    {
      type: coda.ParameterType.String,
      name: "resourceName",
      description: "Name for the dev resource",
    },
    {
      type: coda.ParameterType.String,
      name: "resourceUrl",
      description: "URL for the dev resource",
    },
    {
      type: coda.ParameterType.String,
      name: "fileUrl",
      description: "Figma file URL (to determine file_key)",
    }
  ],
  execute: async function([componentKey, name, url, fileUrl], context) {
    // Extract file_key from fileUrl
    // Lookup component by key to get node_id
    // Call CreateDevResource logic
    // Return success with created resource details
  }
})
```

**Benefits**:
- Users only need component key + name/URL
- Automatic file_key and node_id resolution
- Maintains consistency with existing patterns

### Phase 2: Enhanced CreateDevResource Formula (30 mins)

**Objective**: Add component-key parameter option to existing formula
**Implementation**:
```typescript
// Add optional componentKey parameter
{
  type: coda.ParameterType.String,
  name: "componentKey",
  description: "Optional: Component key to auto-fill file_key and node_id",
  optional: true,
}

// Logic to resolve component if provided
if (componentKey) {
  // Fetch component details to get file_key and node_id
  // Use those instead of manual parameters
}
```

**Benefits**:
- Backward compatible with existing usage
- Provides component-aware option
- Single formula for all use cases

### Phase 3: Button Column Integration (45 mins)

**Objective**: Add button columns to FileComponents table for easy dev resource creation
**Implementation**:

1. **Add Button Column to FileComponents Table**:
   - Button text: "Add Dev Resource"
   - Action: Trigger AddDevResourceToComponent
   - Pre-populate component key from current row

2. **Form Integration**:
   - Simple form with Name and URL fields
   - Component context automatically provided
   - Success feedback with link to created resource

3. **User Experience Flow**:
   ```
   User opens FileComponent record
   → Clicks "Add Dev Resource" button
   → Fills in form (Name, URL)
   → Resource created in Figma
   → Shows in dev_resources array on next sync
   ```

**Benefits**:
- Zero context switching
- Minimal manual input required
- Instant feedback and confirmation

### Phase 4: Automation & Templates (30 mins)

**Objective**: Support automated and template-based resource creation
**Implementation**:

1. **Template Support**:
   ```typescript
   // Add template parameter to formulas
   {
     type: coda.ParameterType.String,
     name: "template",
     description: "Template: 'storybook', 'github', 'jira', 'confluence', 'custom'",
     optional: true,
   }
   ```

2. **URL Pattern Generation**:
   ```typescript
   const templates = {
     storybook: (componentName) => `https://storybook.example.com/?path=/story/${componentName}`,
     github: (componentName) => `https://github.com/org/repo/tree/main/components/${componentName}`,
     jira: () => "https://company.atlassian.net/browse/",
     confluence: () => "https://company.atlassian.net/wiki/spaces/",
   };
   ```

3. **Bulk Component Setup**:
   - Process multiple components at once
   - Apply same template to all selected components
   - Progress tracking for large batches

**Benefits**:
- Standardized resource patterns
- Bulk operations for efficiency
- Consistent team workflows

## 🧪 Testing Strategy

### Unit Testing
1. **Component Key Resolution**: Verify component lookup works correctly
2. **File Key Extraction**: Test URL parsing for file_key extraction
3. **API Integration**: Confirm dev resource creation calls work
4. **Error Handling**: Test invalid component keys and malformed URLs

### Integration Testing
1. **End-to-End Workflow**: Component selection → resource creation → relationship display
2. **Table Refresh**: Verify new resources appear in dev_resources arrays
3. **Button Integration**: Test button column functionality
4. **Template Application**: Verify template URL generation

### User Acceptance Testing
1. **Workflow Simplicity**: Users can create resources without technical knowledge
2. **Error Recovery**: Clear error messages and recovery paths
3. **Performance**: Resource creation completes within acceptable time
4. **Consistency**: Resources appear consistently across sync tables

## 📊 Success Metrics

### Technical Metrics
- **Formula Execution**: < 3 seconds for resource creation
- **Error Rate**: < 5% for valid component keys
- **API Success**: > 95% success rate for dev resource creation
- **Pack Validation**: 100% validation success

### User Experience Metrics
- **Click-to-Resource**: Single click creates resource from component
- **Form Completion**: < 30 seconds to fill and submit
- **Feedback Speed**: Immediate confirmation of creation
- **Sync Visibility**: Resources appear in next table sync (< 1 minute)

## 🚀 Implementation Order

### Session 11 Priority Order:
1. **High Priority**: AddDevResourceToComponent action formula
2. **High Priority**: Enhanced CreateDevResource with component-key support
3. **Medium Priority**: Button column integration
4. **Low Priority**: Template and automation support

### Rationale:
- Start with core functionality (action formulas)
- Add user experience enhancements (buttons)
- Finish with advanced features (templates)
- Maintain backward compatibility throughout

## 🔄 Rollback Plan

If issues arise during implementation:
1. **Formula Issues**: Remove new formulas, keep Version 13 stable
2. **Schema Problems**: Revert schema changes, maintain existing functionality
3. **API Failures**: Add feature flags to disable new workflows
4. **Performance Issues**: Add caching and optimization

## 📝 Documentation Requirements

### User Documentation
1. **Workflow Guide**: Step-by-step component → dev resource creation
2. **Button Usage**: How to use button columns effectively
3. **Template Guide**: Available templates and customization
4. **Troubleshooting**: Common issues and solutions

### Developer Documentation
1. **API Integration**: How component lookup works
2. **Error Handling**: Error types and user messages
3. **Performance**: Optimization techniques and caching
4. **Extension Points**: How to add new templates

## 🎯 Post-Implementation Validation

### Checklist for Session Completion:
- [ ] AddDevResourceToComponent formula working
- [ ] Enhanced CreateDevResource with component support
- [ ] Button column integration functional
- [ ] Template support implemented
- [ ] All tests passing
- [ ] Pack validates and builds successfully
- [ ] Version 14 deployed successfully
- [ ] User documentation updated
- [ ] Next session priorities documented

---

**Next Session Goal**: Complete component-aware dev resource creation workflows
**Success Definition**: Users can create dev resources with one click from any component record
**Pack Version Target**: Version 14 with complete workflow integration