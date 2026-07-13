import React, { createContext, useContext, useState, ReactNode } from "react";
import { CrawlFilters, BarStop, ThemeOption, Occasion } from "../types";

const DEFAULT_FILTERS: CrawlFilters = {
  occasionId: null,
  themeId: null,
  customThemeText: "",
  preferOutdoor: false,
  groupSize: 4,
  stopCount: 4,
  maxWalkMeters: 1500,
  intensity: "spicy",
  crawlLocation: "",
};

type CrawlContextValue = {
  filters: CrawlFilters;
  setFilters: React.Dispatch<React.SetStateAction<CrawlFilters>>;
  selectedOccasion: Occasion | null;
  setSelectedOccasion: (o: Occasion | null) => void;
  selectedTheme: ThemeOption | null;
  setSelectedTheme: (t: ThemeOption | null) => void;
  bars: BarStop[];
  setBars: (b: BarStop[]) => void;
  visitedIds: Set<string>;
  toggleVisited: (id: string) => void;
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (loc: { latitude: number; longitude: number } | null) => void;
};

const CrawlContext = createContext<CrawlContextValue | null>(null);

export function CrawlProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CrawlFilters>(DEFAULT_FILTERS);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption | null>(null);
  const [bars, setBars] = useState<BarStop[]>([]);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const toggleVisited = (id: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <CrawlContext.Provider
      value={{
        filters,
        setFilters,
        selectedOccasion,
        setSelectedOccasion,
        selectedTheme,
        setSelectedTheme,
        bars,
        setBars,
        visitedIds,
        toggleVisited,
        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </CrawlContext.Provider>
  );
}

export function useCrawl() {
  const ctx = useContext(CrawlContext);
  if (!ctx) throw new Error("useCrawl must be used within CrawlProvider");
  return ctx;
}
