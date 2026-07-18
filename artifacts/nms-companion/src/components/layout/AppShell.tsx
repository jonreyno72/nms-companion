import React from 'react';
import { Database, List } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { UpdatePrompt } from './UpdatePrompt';

type ViewState = 'stations' | 'backup';

interface Props {
  view: ViewState;
  onViewChange: (view: ViewState) => void;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  isRightPanelOpen: boolean;
}

export function AppShell({ view, onViewChange, leftPanel, rightPanel, isRightPanelOpen }: Props) {
  const { needRefresh, update } = useServiceWorker();

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 safe-area-top z-10 relative">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="font-bold tracking-tight text-lg hidden sm:block text-foreground">NMS Companion</h1>
        </div>

        <nav className="flex items-center bg-input p-1 rounded-lg border border-border">
          <button
            onClick={() => onViewChange('stations')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'stations' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4" /> Stations
          </button>
          <button
            onClick={() => onViewChange('backup')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'backup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Database className="w-4 h-4" /> Backup
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {view === 'stations' ? (
          <>
            {/* Left Panel (List) - Always visible on large screens, hidden on small when form is open */}
            <div className={`w-full lg:w-[450px] shrink-0 border-r border-border bg-background flex flex-col h-full absolute lg:relative z-0 transition-transform ${isRightPanelOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
              {leftPanel}
            </div>
            
            {/* Right Panel (Form) - Slides in on small screens, fixed beside list on large */}
            <div className={`flex-1 bg-muted/10 h-full absolute lg:relative inset-0 lg:inset-auto z-20 lg:z-auto transition-transform ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
              {rightPanel}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto bg-background w-full h-full">
            {rightPanel} {/* Backup panel rendered here for simplicity */}
          </div>
        )}
      </main>

      <UpdatePrompt show={needRefresh} onUpdate={update} />
    </div>
  );
}
