import '@styles/styles';
import 'focus-visible/dist/focus-visible.min.js';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /^\.\/(?!.*((?:__tests__)|(?:\.d))).*\.((jsx?)|(tsx?))$/));
requireAll(require.context('./pages/', true, /^\.\/(?!.*((?:__tests__)|(?:\.d))).*\.((jsx?)|(tsx?))$/));
