# ESLint Fixes

These are the fixes needed to pass ESLint checks:

1. In `app/auth/signup/page.tsx`: 
   - Replace `We've` with `We&apos;ve`

2. In `app/dashboard/page.tsx`:
   - Replace `haven't` with `haven&apos;t`

3. In `components/AquariumAIAssistant.tsx`:
   - Replace `"Generate Aquarium Image"` with `&quot;Generate Aquarium Image&quot;`
   - Add missing dependencies to useEffect hooks

4. In `components/configurator/ModelLoader.tsx`:
   - Fix conditional useGLTF hook usage by moving it outside of try/catch
   - Add GLTFModel.displayName = 'GLTFModel' after the component definition

5. Create a .eslintrc.json with appropriate rule overrides to disable specific checks if needed
