import '@styles/styles'; // все стили препроцессора всех компонентов и страниц
import '@plugins/styles';
// eslint-disable-next-line no-unused-vars
import $ from "jquery";
import '../node_modules/focus-visible/dist/focus-visible.min.js';
import '@plugins/java-import';


function requireAll(requireContext: any) {
	return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /^\.\/(?!.*(?:__tests__)).*\.((jsx?)|(tsx?))$/));
requireAll(require.context('./pages/', true, /^\.\/(?!.*(?:__tests__)).*\.((jsx?)|(tsx?))$/));

