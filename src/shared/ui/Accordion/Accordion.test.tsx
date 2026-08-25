import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('links the trigger to its region and reflects the open state', () => {
    render(
      <Accordion id="faq-1" summary="Вопрос" open onToggle={() => {}}>
        Ответ
      </Accordion>,
    );
    const trigger = screen.getByRole('button', { name: 'Вопрос' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', 'faq-1-region');
    expect(screen.getByRole('region')).toHaveAttribute('aria-labelledby', 'faq-1-btn');
  });

  it('calls onToggle when the trigger is clicked', () => {
    const onToggle = vi.fn();
    render(
      <Accordion id="faq-1" summary="Вопрос" open={false} onToggle={onToggle}>
        Ответ
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: 'Вопрос' })).toHaveAttribute('aria-expanded', 'false');
    screen.getByRole('button', { name: 'Вопрос' }).click();
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
