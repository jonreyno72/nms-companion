import React, { useEffect, useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { useStations } from '@/hooks/useStations';
import { useDraft } from '@/hooks/useDraft';
import { useSaveState } from '@/hooks/useSaveState';
import { useSearch } from '@/hooks/useSearch';
import { stationRepository } from '@/db/repositories/stationRepository';
import type { FilterState } from '@/types';

import { AppShell } from '@/components/layout/AppShell';
import { FilterBar } from '@/components/stations/FilterBar';
import { StationList } from '@/components/stations/StationList';
import { StationForm } from '@/components/stations/StationForm';
import { BackupPanel } from '@/components/backup/BackupPanel';

function App() {
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const [view, setView] = useState<'stations' | 'backup'>('stations');
  const [filters, setFilters] = useState<FilterState>({ searchQuery: '', guildFilter: 'all', favouritesOnly: false });
  
  const { stations, loading, reload } = useStations();
  const { draft, original, initNew, initEdit, update, cancel, buildStation } = useDraft();
  const { saveState, save } = useSaveState();

  const filteredStations = useSearch(stations, filters);

  const existingNames = useMemo(() => stations.map(s => ({ id: s.id, name: s.name })), [stations]);

  const handleSave = () => {
    const station = buildStation();
    if (!station) return;
    
    save(async () => {
      await stationRepository.save(station);
      await reload();
      // Keep form open but update original to the saved station so it switches from "Add" to "Edit" mode
      initEdit(station);
    });
  };

  const handleDelete = async (id: string) => {
    await stationRepository.delete(id);
    if (original?.id === id) cancel();
    await reload();
  };

  const handleToggleFavourite = async (station: import('@/types').Station) => {
    const updated = { ...station, favourite: !station.favourite };
    await stationRepository.save(updated);
    if (original?.id === station.id) update('favourite', updated.favourite);
    await reload();
  };

  const isFormOpen = draft !== null;

  const leftPanel = (
    <>
      <div className="p-4 border-b border-border bg-card shrink-0 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={filters.searchQuery}
              onChange={e => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
              placeholder="Search stations..."
              className="w-full bg-input border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={initNew}
            className="touch-target bg-primary text-primary-foreground px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add</span>
          </button>
        </div>
        <FilterBar filters={filters} onChange={setFilters} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 safe-area-bottom">
        {loading ? (
          <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <StationList
            stations={filteredStations}
            onEdit={initEdit}
            onDelete={handleDelete}
            onToggleFavourite={handleToggleFavourite}
          />
        )}
      </div>
      {/* Mobile Add Button (floating) - only visible if form closed */}
      {!isFormOpen && (
        <button
          onClick={initNew}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-50 safe-area-bottom"
          aria-label="Add Station"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </>
  );

  const rightPanel = view === 'backup' ? <BackupPanel /> : (
    draft ? (
      <StationForm
        draft={draft}
        original={original}
        saveState={saveState}
        existingNames={existingNames}
        onFieldChange={update}
        onSave={handleSave}
        onCancel={cancel}
      />
    ) : (
      <div className="hidden lg:flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center bg-card/50">
        <div className="w-16 h-16 border-2 border-dashed border-border rounded-full flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 opacity-50">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-foreground mb-2">Select a station to view details</p>
        <p className="max-w-sm opacity-80">Or click "Add" to track a new space station.</p>
      </div>
    )
  );

  return (
    <AppShell
      view={view}
      onViewChange={v => { setView(v); if(v === 'backup') cancel(); }}
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      isRightPanelOpen={isFormOpen && view === 'stations'}
    />
  );
}

export default App;
