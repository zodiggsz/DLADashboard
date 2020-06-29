import { createSlice } from '@reduxjs/toolkit';
// import * as extraActions from './actions';
// import * as selectors from './selectors';

export const slice = createSlice({
    name: 'interests',
    initialState: { loading: false, list: [] },
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        toggleLoading(state) {
            state.loading = !state.loading;
        },
        setList(state, action) {
            state.list = action.payload;
        },
        updateList(state, action) {
            state.list.push(action.payload);
        },
        removeFromList(state, action) {
            state.list = state.list.filter((user) => user.id !== action.payload);
        }
    }
});

// const actions = { ...slice.actions, ...extraActions };
const reducer = slice.reducer;
// export { actions, selectors, reducer };
export default reducer;
