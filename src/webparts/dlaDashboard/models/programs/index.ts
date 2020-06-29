import { createSlice } from '@reduxjs/toolkit';
import * as programActions from './actions';
// import * as selectors from './selectors';

const defaultScores = {
    TargetScore: 0,
    TotalScoreID: 0
};

const defaultInsights = {
    Lens: '',
    Content: ''
};

export const slice = createSlice({
    name: 'programs',
    initialState: {
        loading: false,
        list: [],
        userPrograms: [],
        program: {},
        programScores: {
            governance: defaultScores,
            technology: defaultScores,
            strategy: defaultScores,
            operations: defaultScores,
            people: defaultScores,
        },
        programInsights: {
            governance: [],
            technology: [],
            strategy: [],
            operations: [],
            people: [],
        },
        programInterests: [],
        programImprovements: [],
        programHistory: [],
        budgets: {},
        hasNext: false,
        nextItems: [],
        contracts: [],
        accomplishments: {},
        averageScores: {},
    },
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setProgram(state, action) {
            state.program = action.payload;
        },
        setPrograms(state, action) {
            state.list = action.payload;
        },
        setProgramScores(state, action) {
            state.programScores = action.payload;
        },
        setProgramInsights(state, action) {
            state.programInsights = action.payload;
        },
        setProgramInterests(state, action) {
            state.programInterests = action.payload;
        },
        setProgramImprovements(state, action) {
            state.programImprovements = action.payload;
        },
        setProgramHistory(state, action) {
            state.programHistory = action.payload;
        },
        setUserPrograms(state, action) {
            state.userPrograms = action.payload;
        },
        setContracts(state, action) {
            state.contracts = action.payload;
        },
        setNext(state, action) {
            state.hasNext = action.payload;
        },
        setNextItems(state, action) {
            state.nextItems = action.payload;
        },
        setBudgets(state, action) {
            state.budgets = action.payload;
        },
        addProgramImprovement(state, action) {
            state.programImprovements.push(action.payload);
        },
        updateUserPrograms(state, action) {
            state.userPrograms.push(action.payload);
        },
        addProgram(state, action) {
            state.list.push(action.payload);
        },
        updateContracts(state, action) {
            state.contracts.push(action.payload);
        },
        toggleLoading(state) {
            state.loading = !state.loading;
        },
        setAccomplishments(state, action) {
            state.accomplishments = action.payload;
        },
        // addAccomplishmentSuccess(state, action) {
        //     state.accomplishments.list.push(action.payload);
        // },
        // removeAccomplishment(state, action) {
        //     state.accomplishments.list = state.accomplishments.list.filter((item) => item.id !== action.payload);
        // },
        fetchAverageScoresSuccess(state, action) {
            state.averageScores = action.payload;
        },
        
    }
});

const actions = { ...slice.actions, ...programActions };
const reducer = slice.reducer;
export { actions };
export default reducer;
