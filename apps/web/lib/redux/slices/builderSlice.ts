import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeConfig {
  bgColor: string;       // Page Background
  cardColor: string;     // Form Container Background
  textColor: string;     // Font Color
  btnColor: string;      // Submit Button Color
  borderColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  borderStyle: 'none' | 'thin' | 'thick' | 'double';
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

interface BuilderState {
  fields: any[];
  theme: ThemeConfig;
  settings: {
    collectEmails: boolean;
    limitOneResponse: boolean;
  };
  selectedFieldId: string | null;
  isUnsaved: boolean;
}

// Default "Modern" Theme
const initialTheme: ThemeConfig = {
bgColor: '#f3f4f6',   // Light Gray Page (Tailwind gray-100)
  cardColor: '#ffffff', // White Card (Pure White)
  textColor: '#111827', // Almost Black (Tailwind gray-900) - CRITICAL FOR VISIBILITY
  btnColor: '#2563eb',  // Bright Blue
  borderColor: '#e5e7eb', // Light Gray Border
  borderRadius: 'md',
  borderStyle: 'thin',
  shadow: 'md',
};

const initialState: BuilderState = {
  fields: [],
  theme: initialTheme,
  settings: {
    collectEmails: false,
    limitOneResponse: false,
  },
  selectedFieldId: null,
  isUnsaved: false,
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setFields: (state, action: PayloadAction<any>) => {
      state.fields = action.payload.content || [];
      state.theme = action.payload.theme || initialTheme;
      state.settings = action.payload.settings || { collectEmails: false, limitOneResponse: false };
      state.isUnsaved = false;
    },
    addFields: (state, action: PayloadAction<any>) => {
      state.fields = [...state.fields, ...action.payload];
      state.isUnsaved = true;
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(f => f.id !== action.payload);
      state.isUnsaved = true;
    },
    // 👇 THIS WAS MISSING OR MISUSED
    updateTheme: (state, action: PayloadAction<Partial<ThemeConfig>>) => {
      state.theme = { ...state.theme, ...action.payload };
      state.isUnsaved = true;
    },
    updateSettings: (state, action: PayloadAction<Partial<BuilderState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
      state.isUnsaved = true;
    },
    selectField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },
    updateField: (state, action: PayloadAction<{ id: string; changes: Partial<any> }>) => {
      const index = state.fields.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.fields[index] = { ...state.fields[index], ...action.payload.changes };
        state.isUnsaved = true;
      }
    },
    resetBuilder: () => initialState,
  },
});

export const { 
  setFields, 
  addFields, 
  removeField, 
  updateSettings, 
  updateTheme, 
  resetBuilder, 
  selectField, 
  updateField 
} = builderSlice.actions;

export default builderSlice.reducer;