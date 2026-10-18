import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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

  it('renders an external link when href is provided', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="noopener noreferrer">
        Read
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Read' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('forwards interaction props to an external link', () => {
    const onClick = vi.fn();
    render(
      <Button href="https://example.com" onClick={onClick} aria-label="Open example">
        Read
      </Button>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Open example' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
