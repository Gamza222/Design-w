import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';
import styles from './Button.module.scss';

describe('Button', () => {
  it('renders a native button with its label when no `to` is given', () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('applies the md size class by default', () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveClass(styles.md);
  });

  it('applies the requested size class', () => {
    render(<Button size="lg">Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveClass(styles.lg);
  });
});
