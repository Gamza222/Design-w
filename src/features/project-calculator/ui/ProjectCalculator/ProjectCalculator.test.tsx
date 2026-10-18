import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';

import { createI18n } from '@shared/config';
import { LEAD_DIALOG_EVENT } from '@shared/lib';

import { ProjectCalculator } from './ProjectCalculator';

describe('calculator enquiry', () => {
  it('opens the form immediately with the chosen area, package, extras and subtotal', () => {
    const listener = vi.fn();
    window.addEventListener(LEAD_DIALOG_EVENT, listener);
    render(
      <I18nextProvider i18n={createI18n('ru')}>
        <ProjectCalculator />
      </I18nextProvider>,
    );

    fireEvent.click(screen.getByText('Чертежи + коллажи', { selector: 'span' }).closest('button')!);
    fireEvent.click(screen.getByText('Авторский надзор', { selector: 'span' }).closest('button')!);
    fireEvent.click(screen.getByText('Комплектация', { selector: 'span' }).closest('button')!);
    const area = screen.getByRole('textbox', { name: '3. Укажите площадь объекта' });
    fireEvent.change(area, { target: { value: '80' } });
    fireEvent.blur(area);
    fireEvent.click(screen.getByRole('button', { name: 'Получить точную стоимость' }));

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].detail.context).toMatchObject({
      source: 'calculator',
      area: 80,
      packageId: 'collages',
      packageName: 'Чертежи + коллажи',
      estimate: 200000,
      currency: 'RUB',
      preliminary: true,
      extras: ['Авторский надзор — от 30\u00a0000\u00a0₽/месяц', 'Комплектация — По запросу'],
    });
    window.removeEventListener(LEAD_DIALOG_EVENT, listener);
  });
});
