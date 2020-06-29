import { createSlice } from "@reduxjs/toolkit";
import * as asyncActions from './actions';
// import * as appSelectors from './selectors';

export const slice = createSlice({
    name: 'app',
    initialState: {
        loading: false,
        expandDrawer: false
    },
    reducers: {
        toggleLoading(state) {
            state.loading = !state.loading;
        },
        toggleDrawer(state) {
            state.expandDrawer = !state.expandDrawer;
        },
    }
});

export const actions = { ...slice.actions, ...asyncActions };
export const reducer = slice.reducer;
// export { appSelectors };
export default reducer;
 