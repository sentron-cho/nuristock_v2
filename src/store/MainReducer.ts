import { AlertAlign, AlertType } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';

export interface IAlertReducer {
	message: string;
	timeout: number;
	type: AlertType;
	align: AlertAlign;
	user: string;
	loading: boolean;
	notice: string;
}

const initialState = {
	alert: {
		message: '',
		timeout: 3000,
		type: 'success',
		align: 'right',
	} as IAlertReducer,
	search: '',
	user: '',
	notice: '',
	loading: false,
};

export const MainReducer = createSlice({
	name: 'main',
	initialState,
	reducers: {
		showMessage: (state, action) => {
			state.alert = { ...action.payload };
		},
		hideMessage: (state) => {
			state.alert = { ...initialState.alert };
		},
		setSearch: (state, action) => {
			state.search = action.payload;
		},
		clearSearch: (state) => {
			state.search = '';
		},
		updateUser: (state) => {
			state.user = new Date().valueOf().toString();
		},
		updateNotice: (state) => {
			state.notice = new Date().valueOf().toString();
		},
		showLoading: (state) => {
			state.loading = true;
		},
		hideLoading: (state) => {
			state.loading = false;
		},
	},
});

export const {
	showLoading,
	hideLoading,
	showMessage,
	hideMessage,
	setSearch,
	clearSearch,
	updateUser,
	updateNotice,
} = MainReducer.actions;
export default MainReducer.reducer;
