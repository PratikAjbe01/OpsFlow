import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './authSlice';

interface WorkspaceState {
  currentWorkspace: {
    _id: string;
    name: string;
    slug: string;
  } | null;
}

const initialState: WorkspaceState = {
  currentWorkspace: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setActiveWorkspace: (state, action: PayloadAction<WorkspaceState['currentWorkspace']>) => {
      state.currentWorkspace = action.payload;
    },
    clearWorkspace: (state) => {
      state.currentWorkspace = null;
    },
    
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => {
    
      return initialState; 
    });
  },
});

export const { setActiveWorkspace, clearWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;