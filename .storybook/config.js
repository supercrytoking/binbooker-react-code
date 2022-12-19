import { configure } from "@storybook/react";
import "bootstrap/dist/css/bootstrap.css";

// So jquery doesn't have an error in Storybook
window.$ = {
  get: () => {}
};

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

function loadStories() {
  requireAll(require.context("../", true, /\.story\.jsx?$/));
}

configure(loadStories, module);
