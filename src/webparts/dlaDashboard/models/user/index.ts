import { createSlice } from '@reduxjs/toolkit';
import * as userActions from './actions';
// import * as selectors from './selectors';

export const slice = createSlice({
    name: 'user',
    initialState: { 
        image:"",
        loading: false, 
        drawer: false,
        group: {},
        data: {}, 
        accounts: [],
        hasNext: false,
        nextItems: [],
    },
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setUserGroup(state, action) {
            state.group = action.payload;
        },
        setData(state, action) {
            state.data = action.payload;
        },
        setImage(state, action) {
            state.image = action.payload;
        },
        toggleLoading(state) {
            state.loading = !state.loading;
        },
        toggleDrawer(state) {
            state.drawer = !state.drawer;
        },
        setAccounts(state, action) {
            state.accounts = action.payload;
        },
        setNext(state, action) {
            state.hasNext = action.payload;
        },
        setNextItems(state, action) {
            state.nextItems = action.payload;
        },
        updateAccounts(state, action) {
            state.accounts.push(action.payload);
        },
        removeAccount(state, action) {
            state.accounts = state.accounts.filter((user) => user.ID !== action.payload);
        }
    }
});

const actions = { ...slice.actions, ...userActions };
const reducer = slice.reducer;
export { actions };
export default reducer;
