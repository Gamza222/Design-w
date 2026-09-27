import { readFileSync } from 'node:fs';
import fg from 'fast-glob';
import { expect, it } from 'vitest';

it('defines every spacing token used by a stylesheet', () => {
  const tokens = readFileSync('src/app/styles/tokens.scss', 'utf8');
  const defined = new Set([...tokens.matchAll(/(--space-\d+)\s*:/g)].map((match) => match[1]));
  const missing: string[] = [];
  for (const file of fg.sync('src/**/*.scss')) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/var\(\s*(--space-\d+)\b/g)) {
      if (!defined.has(match[1])) missing.push(`${file}: ${match[1]}`);
    }
  }
  expect(missing, 'Undefined spacing tokens invalidate entire CSS declarations').toEqual([]);
});
