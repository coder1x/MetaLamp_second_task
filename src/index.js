/* eslint no-unused-vars: off */
import $ from 'jquery';
import 'focus-visible/dist/focus-visible.min.js';
import '@styles/styles';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /^\.\/(?!.*((?:__tests__)|(?:\.d))).*\.((scss)|(jsx?)|(tsx?))$/));
requireAll(require.context('./pages/', true, /^\.\/(?!.*((?:__tests__)|(?:\.d))).*\.((scss)|(jsx?)|(tsx?))$/));
