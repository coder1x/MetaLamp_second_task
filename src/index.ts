/* eslint no-unused-vars: off */
// eslint-disable-next-line import/no-unresolved
import '@styles/styles';
// eslint-disable-next-line import/extensions
import 'focus-visible/dist/focus-visible.min.js';

interface RequireContext {
  keys(): string[];
  (id: string): unknown;
  <T>(id: string): T;
  resolve(id: string): string;
  id: string;
}

function requireAll(requireContext: RequireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /^\.\/(?!.*((?:__tests__)|(?:\.d))).*\.((jsx?)|(tsx?))$/));
requireAll(require.context('./pages/', true, /^\.\/(?!.*((?:__tests__)|(?:\.d))).*\.((jsx?)|(tsx?))$/));
