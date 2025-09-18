# Next Session Priorities: Formula Availability Resolution

**Priority**: Critical
**Estimated Duration**: 1-2 hours
**Target Completion**: Session 12
**Pack Version Target**: Version 15 (current) or Version 16 if needed

## 🎯 Primary Objective

Resolve the formula autocomplete issue where dev resource formulas are not appearing in Coda's formula autocomplete despite successful Version 15 deployment.

## 🔍 Current State

### ✅ What's Working
- **Pack Deployment**: Version 15 successfully deployed to Coda
- **Pack Version**: Coda doc correctly shows "latest version (v15)"
- **Codebase Verification**: All 11 formulas confirmed present in source code
- **Build Validation**: Pack validates and builds without errors

### ⚠️ Outstanding Issue
- **Formula Autocomplete**: Dev resource formulas not appearing in `=[Epic Figma to Coda]::` autocomplete
- **Available Formulas**: Only seeing TestConnection, TestTeamAccess, ComponentCard, StyleCard, ComponentSetCard
- **Missing Formulas**: CreateDevResource, UpdateDevResource, DeleteDevResource, BulkCreateDevResources, BulkUpdateDevResources, AddDevResourceToComponent

## 📋 Investigation Plan

### Phase 1: Direct Formula Testing (30 mins)

**Objective**: Determine if formulas exist but aren't autocompleting

**Test Cases**:
1. **Direct CreateDevResource Call**:
   ```
   =[Epic Figma to Coda]::CreateDevResource(
     "Test Resource",
     "https://example.com",
     "VtXQWuUJ7Ydpkly2NJ9dnj",
     "17:43",
     "",
     ""
   )
   ```

2. **Direct AddDevResourceToComponent Call**:
   ```
   =[Epic Figma to Coda]::AddDevResourceToComponent(
     "f7580aa8151193f322620fc24f28522139e465ee",
     "Test Resource",
     "https://www.figma.com/file/VtXQWuUJ7Ydpkly2NJ9dnj",
     "https://example.com"
   )
   ```

3. **Test Error Messages**: If formulas don't exist, should get "Unknown function" error
4. **Test Success**: If formulas work, should create dev resources successfully

### Phase 2: Pack Refresh Strategies (30 mins)

**Objective**: Force Coda to refresh pack formula cache

**Strategies to Try**:
1. **Pack Panel Refresh**:
   - Go to Packs panel
   - Click on "Epic Figma to Coda"
   - Look for refresh/reload options
   - Force update if available

2. **Pack Reconnection**:
   - Disconnect account from pack
   - Reconnect OAuth authentication
   - Test formula availability

3. **Doc-Level Refresh**:
   - Remove pack from doc (won't delete data)
   - Re-add pack to doc
   - Reconnect authentication
   - Test formula availability

4. **Browser Cache Clear**:
   - Clear browser cache/cookies for coda.io
   - Hard refresh (Cmd+Shift+R)
   - Test formula availability

### Phase 3: Alternative Implementation (30 mins)

**Objective**: If formulas unavailable, implement alternative workflows

**Workaround Options**:
1. **Helper Column Approach**:
   - Create formula columns that call dev resource functions
   - Use these as the primary interface
   - Bridge the gap until autocomplete works

2. **Button-Only Workflow**:
   - Focus on button column integration
   - Create multiple button types for different use cases
   - Provide template-specific buttons

3. **Automation Scripts**:
   - Use Coda automations to trigger pack formulas
   - Create rule-based resource creation
   - Bypass manual formula entry

### Phase 4: Escalation Path (30 mins)

**Objective**: Contact Coda support if issue persists

**Information to Provide**:
- Pack ID: 44800
- Pack Version: 15
- Issue Description: Formulas deployed but not autocompleting
- Steps Already Taken: Fresh deployment, validation, testing
- Expected vs Actual Behavior: Should see 11 formulas, only seeing 5

## 🔧 Expected Outcomes

### Best Case: Direct Formulas Work
- Formulas exist and execute correctly
- Issue is purely autocomplete UI problem
- Users can type formulas manually
- Document workaround patterns

### Middle Case: Pack Refresh Resolves Issue
- One of the refresh strategies works
- All formulas become available in autocomplete
- Normal workflow can proceed
- Document refresh procedure for future

### Worst Case: Formulas Not Deployed
- Direct formula calls fail with "Unknown function"
- Need to investigate deployment issue
- Possible Version 16 deployment required
- Escalate to Coda support

## ✅ Success Criteria

1. **Formula Availability**: All 11 formulas accessible in Coda
2. **User Workflow**: User can create dev resources from component context
3. **Button Integration**: Action buttons work correctly
4. **Template Support**: Template-based URL generation functional
5. **Documentation**: Clear guidance for users on available workflows

## 📝 Deliverables

1. **Validation Results**: Test results for direct formula usage
2. **Refresh Procedure**: Documented steps that resolve autocomplete issue
3. **Workaround Guide**: Alternative approaches if formulas unavailable
4. **User Instructions**: Updated setup guide for component-aware workflows
5. **Support Ticket**: Coda support request if escalation needed

## 🎯 Post-Resolution Tasks

Once formulas are available:
1. **End-to-End Testing**: Validate complete component-aware workflows
2. **User Documentation**: Create comprehensive setup and usage guide
3. **Example Workflows**: Document common use cases and templates
4. **Performance Testing**: Verify formula execution speed and reliability
5. **Next Phase Planning**: Prepare for Phase 4 (Enterprise Features)

---

**Session Focus**: Resolve the final blocking issue to enable full component-aware dev resource creation workflows
**Success Definition**: Users can successfully create dev resources directly from component context using any available method
**Priority Level**: Critical - blocks user adoption of new component-aware features