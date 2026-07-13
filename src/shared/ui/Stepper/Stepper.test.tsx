import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Stepper } from './Stepper';

const labels = { decreaseLabel: 'Уменьшить', increaseLabel: 'Увеличить' };

describe('Stepper', () => {
  it('increments and decrements within bounds', () => {
    const onChange = vi.fn();
    render(<Stepper value={2} min={1} max={3} onChange={onChange} {...labels} />);
    screen.getByLabelText('Увеличить').click();
    expect(onChange).toHaveBeenLastCalledWith(3);
    screen.getByLabelText('Уменьшить').click();
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('disables the decrease button at the minimum', () => {
    render(<Stepper value={1} min={1} max={3} onChange={() => {}} {...labels} />);
    expect(screen.getByLabelText('Уменьшить')).toBeDisabled();
  });

  it('disables the increase button at the maximum', () => {
    render(<Stepper value={3} min={1} max={3} onChange={() => {}} {...labels} />);
    expect(screen.getByLabelText('Увеличить')).toBeDisabled();
  });
});
