/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-clean-order'],
  rules: {
    // CSS Modules use camelCase class names.
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'scss/dollar-variable-pattern': null,
    'scss/at-mixin-pattern': null,
    // Allow `list-style: revert` etc.
    'declaration-property-value-no-unknown': null,
  },
};
