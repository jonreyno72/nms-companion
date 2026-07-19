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
  stationType: 'space',
  economyType: 'unknown',
  wealth: 0,
  exosuitUpgradePurchased: false,
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

  // ── Outlaw station styling ────────────────────────────────────────────────

  it('shows an OUTLAW badge for outlaw stations', () => {
    render(<StationRow station={{ ...STATION, stationType: 'outlaw' }} {...handlers} />);
    expect(screen.getByText('OUTLAW')).toBeInTheDocument();
  });

  it('does not show an OUTLAW badge for space stations', () => {
    render(<StationRow station={STATION} {...handlers} />);
    expect(screen.queryByText('OUTLAW')).not.toBeInTheDocument();
  });

  it('applies the destructive row styling for outlaw stations', () => {
    render(<StationRow station={{ ...STATION, stationType: 'outlaw' }} {...handlers} />);
    const row = screen.getByRole('listitem');
    expect(row.className).toMatch(/bg-destructive/);
  });

  // ── Favourite marker (bookmark, replaces the previous star) ────────────────

  it('favourite toggle button has an accessible label', () => {
    render(<StationRow station={STATION} {...handlers} />);
    expect(screen.getByLabelText('Add to favourites')).toBeInTheDocument();
  });

  it('favourite toggle label flips when the station is already a favourite', () => {
    render(<StationRow station={{ ...STATION, favourite: true }} {...handlers} />);
    expect(screen.getByLabelText('Remove from favourites')).toBeInTheDocument();
  });

  // ── Economy type & wealth ───────────────────────────────────────────────────

  it('shows an economy type tag when set', () => {
    render(<StationRow station={{ ...STATION, economyType: 'mining' }} {...handlers} />);
    expect(screen.getByText(/Mining/)).toBeInTheDocument();
  });

  it('does not show an economy type tag when unknown', () => {
    render(<StationRow station={STATION} {...handlers} />);
    expect(screen.queryByText('Unknown')).not.toBeInTheDocument();
  });

  it('shows wealth stars when wealth is set', () => {
    render(<StationRow station={{ ...STATION, wealth: 2 }} {...handlers} />);
    expect(screen.getByLabelText('Wealth: 2 stars')).toBeInTheDocument();
  });

  it('shows no wealth indicator when wealth is not set', () => {
    render(<StationRow station={STATION} {...handlers} />);
    expect(screen.queryByLabelText(/Wealth:/)).not.toBeInTheDocument();
  });

  it('shows the skull indicator for an Outlaw System wealth rating', () => {
    render(<StationRow station={{ ...STATION, wealth: 4 }} {...handlers} />);
    expect(screen.getByLabelText('Wealth: Outlaw System')).toBeInTheDocument();
  });

  it('does not show star wealth alongside the Outlaw System skull', () => {
    render(<StationRow station={{ ...STATION, wealth: 4 }} {...handlers} />);
    expect(screen.queryByLabelText(/Wealth: \d star/)).not.toBeInTheDocument();
  });

  // ── Outlaw stations hide Guild/Race ─────────────────────────────────────────

  it('shows guild and race tags for a Space Station', () => {
    render(<StationRow station={{ ...STATION, stationType: 'space' }} {...handlers} />);
    expect(screen.getByText(/Explorers/)).toBeInTheDocument();
  });

  it('hides the guild tag for an Outlaw Station', () => {
    render(<StationRow station={{ ...STATION, stationType: 'outlaw' }} {...handlers} />);
    expect(screen.queryByText(/Explorers/)).not.toBeInTheDocument();
  });

  it('hides the race tag for an Outlaw Station', () => {
    render(<StationRow station={{ ...STATION, stationType: 'outlaw', raceId: 'korvax' }} {...handlers} />);
    expect(screen.queryByText(/Korvax/)).not.toBeInTheDocument();
  });

  it('accessible label does not reference guild for an Outlaw Station', () => {
    render(<StationRow station={{ ...STATION, stationType: 'outlaw' }} {...handlers} />);
    const row = screen.getByRole('listitem');
    expect(row.getAttribute('aria-label')).toBe('Hepta Station, Outlaw Station');
  });
});
