// Core exports (no React dependency)
export { default as Mutastate } from './Mutastate';
export { default as singleton } from './singleton';
export { default as MutastateAgent } from './MutastateAgent';
export { default as ProxyAgent } from './ProxyAgent';
export { default as changeWrapper } from './changeWrapper';

// Export types
export * from './types';

// Default export
export { default } from './Mutastate';

// Note: For React features (useMutastate, withMutastate), import from 'mutastate/react'