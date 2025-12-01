# Fix SES React errors and add component debugging

## Summary

This PR fixes SES module errors on local expert pages and adds comprehensive debugging to React components to diagnose rendering issues.

## Changes Made

### 1. Fixed Missing Dependencies
- ✅ Added `@supabase/supabase-js` ^2.39.0 to package.json
- ✅ Added `react` ^18.2.0 to package.json
- These were causing the SES import errors

### 2. Added Component Debugging
- 🔍 Console logging with colored emoji indicators (🟢🟡🔵✅)
- 🔍 Visual debug banners on ExpertForm (blue) and ExpertDirectory (purple)
- 🔍 TestComponent for immediate visual verification
- 🔍 State and lifecycle tracking

### 3. Documentation
- 📚 Created comprehensive README in _components/ directory
- 📚 Documents all components, their usage, and troubleshooting
- 📚 Explains expected analytics errors (Amplitude, GA CORS warnings)

## Debug Features

### Console Logs
- 🟢 = Loading _components/index.js
- 🟡 = Loading supabase.js and client creation
- 🔵 = Loading ExpertDirectory.jsx module
- ✅ = Component mounting and rendering

### Visual Indicators
- Red TestComponent box on affected pages
- Blue debug banner showing ExpertForm status
- Purple debug banner showing ExpertDirectory data counts

## Testing

1. Visit `/get-involved/local-expert-connections`
2. Visit `/experts`
3. Check browser console for emoji indicators
4. Look for colored debug banners
5. Verify TestComponent red box appears

## Files Changed

- `package.json` - Added missing dependencies
- `_components/README.md` - New comprehensive documentation
- `_components/supabase.js` - Added debug logging
- `_components/index.js` - Added debug logging
- `_components/ExpertForm.jsx` - Added debug logging and visual banner
- `_components/ExpertDirectory.jsx` - Added debug logging and visual banner
- `_components/TestComponent.jsx` - New test component
- `get-involved/local-expert-connections.mdx` - Added TestComponent
- `experts/index.mdx` - Added TestComponent

## Known Issues (Not Breaking)

The following console warnings are **expected and harmless**:
- Amplitude CORS errors (analytics blocked in local dev)
- Google Analytics loading warnings
- Cookie rejection messages

These don't affect functionality and typically resolve in production.

## Next Steps

After verifying components load correctly:
1. Remove TestComponent from MDX files
2. Remove debug banners from components
3. Clean up console.log statements (or make them conditional on dev mode)

---

## Commits

- `9fef386` Fix SES React errors by adding missing dependencies
- `e56189d` Add comprehensive debugging to React components
