import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PillToggle } from './PillToggle';

describe('PillToggle', () => {
  it('exposes its pressed state via aria-pressed', () => {
    render(
      <PillToggle pressed onPressedChange={() => {}}>
        3D
      </PillToggle>,
    );
    expect(screen.getByRole('button', { pressed: true })).toBeInTheDocument();
  });

  it('requests the opposite state on click', () => {
    const onPressedChange = vi.fn();
    render(
      <PillToggle pressed={false} onPressedChange={onPressedChange}>
        3D
      </PillToggle>,
    );
    screen.getByRole('button').click();
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});
