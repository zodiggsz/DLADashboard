import { createSelector } from 'reselect';

const userSelector = state => state.user.data;

export const getUser = createSelector(userSelector, (user) => user || {});
