import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CrawlFilters, BarStop, ThemeOption, Occasion, SavedList } from "../types";

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
  savedLists: SavedList[];
  setSavedLists: (lists: SavedList[]) => void;
  createList: (name: string) => Promise<SavedList>;
  deleteList: (listId: string) => Promise<void>;
  addBarToList: (listId: string, bar: BarStop) => Promise<void>;
  removeBarFromList: (listId: string, barId: string) => Promise<void>;
  loadLists: () => Promise<void>;
};

const CrawlContext = createContext<CrawlContextValue | null>(null);

export function CrawlProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CrawlFilters>(DEFAULT_FILTERS);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption | null>(null);
  const [bars, setBars] = useState<BarStop[]>([]);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);

  const toggleVisited = (id: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const loadLists = async () => {
    try {
      const stored = await AsyncStorage.getItem("crawl_lists");
      if (stored) setSavedLists(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load lists:", e);
    }
  };

  const createList = async (name: string): Promise<SavedList> => {
    const newList: SavedList = {
      id: Date.now().toString(),
      name,
      bars: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [...savedLists, newList];
    setSavedLists(updated);
    await AsyncStorage.setItem("crawl_lists", JSON.stringify(updated));
    return newList;
  };

  const deleteList = async (listId: string) => {
    const updated = savedLists.filter((l) => l.id !== listId);
    setSavedLists(updated);
    await AsyncStorage.setItem("crawl_lists", JSON.stringify(updated));
  };

  const addBarToList = async (listId: string, bar: BarStop) => {
    const updated = savedLists.map((l) => {
      if (l.id === listId && !l.bars.find((b) => b.id === bar.id)) {
        return { ...l, bars: [...l.bars, bar], updatedAt: Date.now() };
      }
      return l;
    });
    setSavedLists(updated);
    await AsyncStorage.setItem("crawl_lists", JSON.stringify(updated));
  };

  const removeBarFromList = async (listId: string, barId: string) => {
    const updated = savedLists.map((l) => {
      if (l.id === listId) {
        return { ...l, bars: l.bars.filter((b) => b.id !== barId), updatedAt: Date.now() };
      }
      return l;
    });
    setSavedLists(updated);
    await AsyncStorage.setItem("crawl_lists", JSON.stringify(updated));
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
        savedLists,
        setSavedLists,
        createList,
        deleteList,
        addBarToList,
        removeBarFromList,
        loadLists,
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
