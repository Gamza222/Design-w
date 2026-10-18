import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Stepper } from './Stepper';

const labels = { decreaseLabel: 'Уменьшить', increaseLabel: 'Увеличить' };

const getInput = () => screen.getByLabelText<HTMLInputElement>('Площадь', { selector: 'input' });

describe('Stepper', () => {
  it('increments and decrements within bounds', () => {
    const onChange = vi.fn();
    render(<Stepper value={2} min={1} max={3} onChange={onChange} {...labels} />);
    screen.getByLabelText('Увеличить').click();
    expect(onChange).toHaveBeenLastCalledWith(3);
    screen.getByLabelText('Уменьшить').click();
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('marks the decrease button aria-disabled at the minimum and ignores clicks', () => {
    const onChange = vi.fn();
    render(<Stepper value={1} min={1} max={3} onChange={onChange} {...labels} />);
    const btn = screen.getByLabelText('Уменьшить');
    // aria-disabled вместо disabled: кнопка остаётся в tab-order, клик игнорируется.
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    btn.click();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('marks the increase button aria-disabled at the maximum and ignores clicks', () => {
    const onChange = vi.fn();
    render(<Stepper value={3} min={1} max={3} onChange={onChange} {...labels} />);
    const btn = screen.getByLabelText('Увеличить');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    btn.click();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('commits a manually typed value on blur', () => {
    const onChange = vi.fn();
    render(
      <Stepper value={72} min={20} max={400} onChange={onChange} label="Площадь" {...labels} />,
    );
    fireEvent.change(getInput(), { target: { value: '150' } });
    fireEvent.blur(getInput());
    expect(onChange).toHaveBeenLastCalledWith(150);
  });

  it('clamps a typed value to the bounds', () => {
    const onChange = vi.fn();
    render(
      <Stepper value={72} min={20} max={400} onChange={onChange} label="Площадь" {...labels} />,
    );
    fireEvent.change(getInput(), { target: { value: '9999' } });
    fireEvent.blur(getInput());
    expect(onChange).toHaveBeenLastCalledWith(400);
  });

  it('reverts empty or non-numeric input without calling onChange', () => {
    const onChange = vi.fn();
    render(
      <Stepper value={72} min={20} max={400} onChange={onChange} label="Площадь" {...labels} />,
    );
    fireEvent.change(getInput(), { target: { value: '' } });
    fireEvent.blur(getInput());
    expect(onChange).not.toHaveBeenCalled();
    expect(getInput()).toHaveValue('72');
  });

  it('commits on Enter via blur and strips non-digits while typing', () => {
    const onChange = vi.fn();
    render(
      <Stepper value={72} min={20} max={400} onChange={onChange} label="Площадь" {...labels} />,
    );
    fireEvent.change(getInput(), { target: { value: '1a2b' } });
    expect(getInput()).toHaveValue('12');
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    fireEvent.blur(getInput());
    expect(onChange).toHaveBeenLastCalledWith(20);
  });
});
