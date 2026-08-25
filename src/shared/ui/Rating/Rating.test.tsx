import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Rating } from './Rating';

describe('Rating', () => {
  it('exposes the value through an accessible label', () => {
    render(<Rating value={4.9} />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '4.9 / 5');
  });

  it('uses a custom label when provided', () => {
    render(<Rating value={4.9} label="4.9 из 5" />);
    expect(screen.getByRole('img', { name: '4.9 из 5' })).toBeInTheDocument();
  });
});
