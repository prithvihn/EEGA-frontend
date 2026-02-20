import { create } from 'zustand';
import { MOCK_EMERGENCY_RESULT, SCENARIO_MOCK_DATA, type MockEmergencyResult } from '@/lib/mockData';
import { analyzeEmergency as callAnalyzeAPI } from '@/lib/api';

interface EmergencyState {
  emergencyText: string;
  isRecording: boolean;
  isLoading: boolean;
  hasResult: boolean;
  mockResult: MockEmergencyResult | null;
  location: { lat: number; lng: number } | null;
  guidance: string;
  error: string | null;
  emergencyType: string;
  setEmergencyText: (text: string) => void;
  toggleRecording: () => void;
  setRecording: (recording: boolean) => void;
  setGuidance: (guidance: string) => void;
  setError: (error: string | null) => void;
  setEmergencyType: (type: string) => void;
  submitEmergency: (scenarioId?: number) => Promise<void>;
  analyzeEmergency: () => Promise<void>;
  clearResult: () => void;
  setLocation: (location: { lat: number; lng: number } | null) => void;
}

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  emergencyText: '',
  isRecording: false,
  isLoading: false,
  hasResult: false,
  mockResult: null,
  location: null,
  guidance: '',
  error: null,
  emergencyType: '',

  setEmergencyText: (text) => set({ emergencyText: text }),

  toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),

  setRecording: (recording) => set({ isRecording: recording }),

  setGuidance: (guidance) => set({ guidance }),

  setError: (error) => set({ error }),

  setEmergencyType: (type) => set({ emergencyType: type }),

  submitEmergency: async (scenarioId?: number) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const mockResult =
      scenarioId && SCENARIO_MOCK_DATA[scenarioId]
        ? SCENARIO_MOCK_DATA[scenarioId]
        : MOCK_EMERGENCY_RESULT;
    set({
      isLoading: false,
      hasResult: true,
      mockResult,
      guidance: '',
      error: null,
    });
  },

  analyzeEmergency: async () => {
    const { emergencyText, emergencyType } = get();
    if (!emergencyText.trim()) {
      set({ error: 'Please describe your emergency first.' });
      return;
    }

    set({ isLoading: true, error: null, guidance: '', mockResult: null, hasResult: false });

    try {
      const result = await callAnalyzeAPI(emergencyText, emergencyType);
      set({
        guidance: result.guidance,
        emergencyType: result.emergency_type,
        isLoading: false,
        hasResult: true,
        error: null,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to analyze emergency.',
        isLoading: false,
      });
    }
  },

  clearResult: () => set({ hasResult: false, mockResult: null, guidance: '', error: null }),

  setLocation: (location) => set({ location }),
}));
