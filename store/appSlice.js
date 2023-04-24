import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hasMenuExpanded: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setHasMenuExpanded(state, { payload }) {
            state.hasMenuExpanded = payload;
        },
    },
});

export const { setHasMenuExpanded } = appSlice.actions;
export default appSlice.reducer;
