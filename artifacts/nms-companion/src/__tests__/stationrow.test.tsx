/**
 * StationRow action-icon visibility tests.
 *
 * These guard against the production-only regression where the Edit and Delete
 * icons were invisible on touch devices (iPad Safari / installed PWA) because
 * their container carried `sm:opacity-0` — visible only via a CSS :hover that
 * never fires on touch — instead of being unconditionally rendered.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StationRow } from '@/components/stations/StationRow';
import type { Station } from '@/types';

// Stub framer-motion so tests run without animation infrastructure.
// We only need motion.li (used by StationRow) to be a plain <li>.
vi.mock('framer-motion', () => ({
  motion: {
    li: React.forwardRef(function MotionLi(
      { children, className, role, 'aria-label': ariaLabel }: any,
      ref: any,
    ) {
      return React.createElement(
        'li',
        { className, role, 'aria-label': ariaLabel, ref },
        children,
      );
    }),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const STATION: Station = {
  id: 'test-1',
  name: 'Hepta Station',
  guildId: 'explorers',
  raceId: 'korvax',
  favourite: false,
  rewards: [],
  donationItems: [],
  notes: '',
  createdAt: 0,
  updatedAt: 0,
};

describe('StationRow — Edit and Delete icon visibility', () => {
  const handlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggleFavourite: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  // ── Button presence ──────────────────────────────────────────────────────

  it('renders the Edit action button with the correct aria-label', () => {
    render(<StationRow station={STATION} {...handlers} />);
    expect(screen.getByRole('button', { name: 'Edit station' })).toBeInTheDocument();
  });

  it('renders the Delete action button with the correct aria-label', () => {
    render(<StationRow station={STATION} {...handlers} />);
    expect(screen.getByRole('button', { name: 'Delete station' })).toBeInTheDocument();
  });

  // ── SVG icon presence ────────────────────────────────────────────────────

  it('Edit button contains an SVG icon', () => {
    render(<StationRow station={STATION} {...handlers} />);
    const btn = screen.getByRole('button', { name: 'Edit station' });
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('Delete button contains an SVG icon', () => {
    render(<StationRow station={STATION} {...handlers} />);
    const btn = screen.getByRole('button', { name: 'Delete station' });
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  // ── Explicit SVG attributes ──────────────────────────────────────────────
  // Ensures width/height are present as real SVG attributes (not CSS-only),
  // and that stroke is explicitly currentColor so the icon inherits the
  // button's text colour in every render context.

  it('Edit icon SVG has an explicit positive width attribute', () => {
    render(<StationRow station={STATION} {...handlers} />);
    const svg = screen.getByRole('button', { name: 'Edit station' }).querySelector('svg');
    expect(Number(svg?.getAttribute('width'))).toBeGreaterThan(0);
  });

  it('Edit icon SVG has an explicit positive height attribute', () => {
    render(<StationRow station={STATION} {...handlers} />);
    const svg = screen.getByRole('button', { name: 'Edit station' }).querySelector('svg');
    expect(Number(svg?.getAttribute('height'))).toBeGreaterThan(0);
  });

  it('Delete icon SVG has an explicit positive width attribute', () => {
    render(<StationRow station={STATION} {...handlers} />);
    const svg = screen.getByRole('button', { name: 'Delete station' }).querySelector('svg');
    expect(Number(svg?.getAttribute('width'))).toBeGreaterThan(0);
  });

  it('Delete icon SVG has an explicit positive height attribute', () => {
    render(<StationRow station={STATION} {...handlers} />);
    const svg = screen.getByRole('button', { name: 'Delete station' }).querySelector('svg');
    expect(Number(svg?.getAttribute('height'))).toBeGreaterThan(0);
  });

  it('Edit icon SVG has stroke="currentColor"', () => {
    render(<StationRow station={STATION} {...handlers} />);
    const svg = screen.getByRole('button', { name: 'Edit station' }).querySelector('svg');
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
  });

  it('Delete icon SVG has stroke="currentColor"', () => {
    render(<StationRow station={STATION} {...handlers} />);
    const svg = screen.getByRole('button', { name: 'Delete station' }).querySelector('svg');
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
  });

  // ── No hidden-by-opacity container ──────────────────────────────────────
  // The original bug: the wrapper div had sm:opacity-0 which hid the icons
  // on iPad (≥640 px viewport) because CSS :hover never fires on touch.

  it('action button container does not carry an opacity-0 class', () => {
    render(<StationRow station={STATION} {...handlers} />);
    const container = screen
      .getByRole('button', { name: 'Edit station' })
      .closest('div');
    expect(container?.className ?? '').not.toMatch(/\bopacity-0\b/);
  });
});
