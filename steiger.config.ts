import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      // A young scaffold legitimately has slices referenced once (e.g. an entity
      // used by a single widget). They are meant to grow — don't push to inline them.
      'fsd/insignificant-slice': 'off',
    },
  },
]);
