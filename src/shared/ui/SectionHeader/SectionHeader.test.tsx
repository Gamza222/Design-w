import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders the title as a heading with eyebrow and subtitle', () => {
    render(<SectionHeader eyebrow="Процесс" title="Как мы работаем" subtitle="Понятные этапы" />);
    expect(screen.getByRole('heading', { name: 'Как мы работаем' })).toBeInTheDocument();
    expect(screen.getByText('Процесс')).toBeInTheDocument();
    expect(screen.getByText('Понятные этапы')).toBeInTheDocument();
  });

  it('renders only the title when eyebrow/subtitle are omitted', () => {
    render(<SectionHeader title="Заголовок" />);
    expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeInTheDocument();
  });
});
