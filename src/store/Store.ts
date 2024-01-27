import { configureStore } from '@reduxjs/toolkit';
import MainReducer from './MainReducer';
// import { useDispatch } from 'react-redux';

export const store = configureStore({
	reducer: {
		main: MainReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
