import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Field } from './Field';

describe('Field', () => {
  it('associates the label with the control via htmlFor/id', () => {
    render(
      <Field id="name" label="Имя">
        <input id="name" />
      </Field>,
    );
    expect(screen.getByLabelText('Имя')).toBe(screen.getByRole('textbox'));
  });

  it('renders an error message with an alert role', () => {
    render(
      <Field id="phone" label="Телефон" error="Введите корректный телефон">
        <input id="phone" />
      </Field>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Введите корректный телефон');
  });
});
