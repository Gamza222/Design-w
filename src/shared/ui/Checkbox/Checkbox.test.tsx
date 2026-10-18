import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('associates the label with the checkbox', () => {
    render(<Checkbox label="Я согласен" />);
    expect(screen.getByLabelText('Я согласен')).toBe(screen.getByRole('checkbox'));
  });

  it('fires onChange when toggled', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Я согласен" onChange={onChange} />);
    screen.getByRole('checkbox').click();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('reflects the checked prop', () => {
    render(<Checkbox label="Я согласен" checked readOnly />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
