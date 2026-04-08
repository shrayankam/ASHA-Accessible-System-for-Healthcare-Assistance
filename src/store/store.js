import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    userProfile: null,
    isLoading: true,

    setUser: (user) => set({ user, isLoading: false }),
    setUserProfile: (userProfile) => set({ userProfile }),
    setLoading: (isLoading) => set({ isLoading }),
    clearUser: () => set({ user: null, userProfile: null }),
}));

export const useHealthStore = create((set, get) => ({
    currentReport: null,
    analysisResult: null,
    pastReports: [],
    isAnalyzing: false,

    setCurrentReport: (report) => set({ currentReport: report }),
    setAnalysisResult: (result) => set({ analysisResult: result }),
    setPastReports: (reports) => set({ pastReports: reports }),
    setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    clearReport: () => set({ currentReport: null, analysisResult: null }),
}));

export const useSchemeStore = create((set) => ({
    schemes: [],
    filteredSchemes: [],
    selectedCategory: 'all',
    isLoading: false,

    setSchemes: (schemes) => set({ schemes, filteredSchemes: schemes }),
    setFilteredSchemes: (filteredSchemes) => set({ filteredSchemes }),
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    setLoading: (isLoading) => set({ isLoading }),
}));