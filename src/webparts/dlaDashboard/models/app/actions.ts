import { slice } from './index';

export function toggleDrawer(drawer) {
    return async (dispatch) => {
        dispatch(slice.actions.toggleDrawer());
    };
}

export function toggleLoader(loader) {
    return async (dispatch) => {
        dispatch(slice.actions.toggleLoading());
    };
}

