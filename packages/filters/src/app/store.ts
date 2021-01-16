import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../features/filters/filterSlice';

export const store = configureStore({
	reducer: {
		filters: filtersReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
