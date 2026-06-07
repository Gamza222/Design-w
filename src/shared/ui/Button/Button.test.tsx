import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders a native button with its label when no `to` is given', () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });
});
