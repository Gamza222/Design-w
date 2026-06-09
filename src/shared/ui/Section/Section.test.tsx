import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Section } from './Section';

describe('Section', () => {
  it('exposes the tone via the data-tone attribute', () => {
    const { container } = render(<Section tone="dark">x</Section>);
    expect(container.querySelector('section')).toHaveAttribute('data-tone', 'dark');
  });

  it('renders no data-tone attribute when tone is omitted', () => {
    const { container } = render(<Section>x</Section>);
    expect(container.querySelector('section')).not.toHaveAttribute('data-tone');
  });
});
