# Mutastate Usage Guide

## Import Paths

Mutastate now provides separate entry points for core and React features:

### Core Features (No React required)

```javascript
// Import from main package - works without React
import { Mutastate, singleton, MutastateAgent, ProxyAgent } from 'mutastate';

const state = singleton();
state.set('user.name', 'John');
console.log(state.get('user.name')); // 'John'
```

### React Features (Requires React)

```javascript
// Import from 'mutastate/react' - requires React
import { useMutastate, withMutastate } from 'mutastate/react';

// Also re-exports core features for convenience
import { singleton, Mutastate } from 'mutastate/react';

function MyComponent() {
  const [count, setCount] = useMutastate('count', { defaultValue: 0 });

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## Benefits

1. **Smaller bundles**: If you don't use React features, React won't be in your bundle at all
2. **No peer dependency errors**: Core features work without React installed
3. **Better tree-shaking**: Bundlers can eliminate unused code more effectively
4. **Clearer separation**: React-specific features are explicitly imported

## Migration Guide

If you're upgrading from an older version:

### Before
```javascript
import { useMutastate, Mutastate } from 'mutastate';
```

### After
```javascript
// Option 1: Import from react entry point
import { useMutastate, Mutastate } from 'mutastate/react';

// Option 2: Import separately (recommended)
import { Mutastate } from 'mutastate';
import { useMutastate } from 'mutastate/react';
```

## Available Imports

### From `mutastate`:
- `Mutastate` (default and named export)
- `singleton`
- `MutastateAgent`
- `ProxyAgent`
- `changeWrapper`
- All TypeScript types

### From `mutastate/react`:
- Everything from `mutastate` (for convenience)
- `useMutastate`
- `withMutastate`
- `withMutastateCreator`
