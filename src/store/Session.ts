import { IJsonData } from '@/types/interfaces';

export const setItem = (
	key: string,
	value: string | IJsonData | Array<IJsonData>
) => {
	if (typeof value === 'string') {
		sessionStorage.setItem(key, value);
	} else {
		sessionStorage.setItem(key, JSON.stringify(value));
	}
};

export const getItem = (key: string) => {
	const value = sessionStorage.getItem(key);
	if (value) {
		try {
			const ret = JSON.parse(value);
			return ret;
		} catch (error) {
			return value;
		}
	} else {
		return '';
	}
};

export const removeItem = (key: string) => {
	sessionStorage.removeItem(key);
};

export const clear = () => {
	sessionStorage.clear();
};

const SKEY = {
	user_info: 'user-info',
	recent_temp: 'recent-temp',
	editor_param: 'editor-param',
	use_login: 'use-login',
};

const Session = {
	setUserInfo: (value: Record<string, string>) => {
		setItem(SKEY.user_info, value);
	},

	getUserInfo: () => {
		return getItem(SKEY.user_info);
	},

	updateUserInfo: (value: any) => {
		try {
			console.log({ userinfo: getItem(SKEY.user_info), value });
			const userinfo = { ...getItem(SKEY.user_info), ...value };
			setItem(SKEY.user_info, userinfo);
		} catch (error) {
			console.error(error);
			return null;
		}
	},

	removeUserInfo: () => {
		removeItem(SKEY.user_info);
	},

	getLoginId: () => {
		return Session.getUserInfo()?.email || null;
	},

	getUserId: () => {
		return Session.getUserInfo()?.id || null;
	},

	getAuthroization: () => {
		const { accessToken, refreshToken, accessTokenExpireDate } =
			Session.getUserInfo();
		return { accessToken, refreshToken, accessTokenExpireDate } || null;
	},

	setEditorParam: (value: Record<string, string>) => {
		setItem(SKEY.editor_param, value);
	},

	getEditorParam: () => {
		return getItem(SKEY.editor_param);
	},

	removeEditorParam: () => {
		removeItem(SKEY.editor_param);
	},

	setCheckRegistLogin: (value: Record<string, string>) => {
		localStorage.setItem(SKEY.use_login, JSON.stringify(value));
	},

	getCheckRegistLogin: () => {
		const value = localStorage.getItem(SKEY.use_login);
		if (value) {
			try {
				const ret = JSON.parse(value);
				if (!ret.email || !ret.password) {
					localStorage.removeItem(SKEY.use_login);
					return '';
				} else {
					return ret;
				}
			} catch (error) {
				return value;
			}
		} else {
			return '';
		}
	},

	removeCheckRegistLogin: () => {
		localStorage.removeItem(SKEY.use_login);
	},
};

export default Session;
