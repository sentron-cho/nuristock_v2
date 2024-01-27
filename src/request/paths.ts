export const path = {
	root: '/',
	apps: 'apps',
	editor: 'editor',
	auth: 'auth',
	login: 'login',
	recover: 'recover',
	register: 'register',
	dashboard: 'dashboard',
	recent: 'recent',
	favorite: 'favorite',
	library: 'library',
	template: 'template',
	request: 'request',
	faq: 'faq',
	contact: 'contact',
	notice: 'notice',
	users: 'users',
	setting: 'setting',
	terms: 'terms',
	privacy: 'privacy',
	version: 'version',
	api: 'scidraw',
};

export const $url = {
	name: path,
	root: path.root,
	apps: {
		root: `/${path.apps}`,
		dashboard: `/${path.apps}/${path.dashboard}`,
		recent: `/${path.apps}/${path.recent}`,
		favorite: `/${path.apps}/${path.favorite}`,
		library: `/${path.apps}/${path.library}`,
		template: `/${path.apps}/${path.template}`,
		request: `/${path.apps}/${path.request}`,
		faq: `/${path.apps}/${path.faq}`,
		contact: `/${path.apps}/${path.contact}`,
		notice: `/${path.apps}/${path.notice}`,
		users: `/${path.apps}/${path.users}`,
		setting: `/${path.apps}/${path.setting}`,
		terms: `/${path.apps}/${path.terms}`,
		privacy: `/${path.apps}/${path.privacy}`,
		version: `/${path.apps}/${path.version}`,
	},
	editor: {
		root: `/${path.editor}`,
		main: `/${path.editor}/main`,
	},
	login: {
		root: `/${path.login}`,
	},
	auth: {
		root: `/${path.auth}`,
		recover: `/${path.auth}/${path.recover}`,
		register: `/${path.auth}/${path.register}`,
	},
};

export const $api = {
	root: {
		subscribe: `/${path.api}/subscribe'`,
	},
	auth: {
		login: `/${path.api}/login`, // ok
		code: {
			check: `/${path.api}/auth/code/check`,
			request: `/${path.api}/auth/code/request`,
		},
		regist: {
			user: `/${path.api}/signup`, // ok
		},
		recover: {
			password: `/${path.api}/auth/recover/password`,
		},
	},
	member: {
		root: `/${path.api}/user`, // ok
		remove: (id: string | number) => `/${path.api}/user/${id}`, // ok
		user: (id: string | number) => `/${path.api}/user/id/${id}?lang=ko`, // ok
		list: `/${path.api}/users`, // ok
	},
	library: {
		list: `/${path.api}/libraries`, // ok
		save: `/${path.api}/library/save`, // ok
		update: `/${path.api}/library/update`, // ok
		all: `/${path.api}/libraries/all`, // ok
		get: (id: string | number) => `/${path.api}/library/id/${id}?lang=ko`, //ok
		remove: (id: string | number) => `/${path.api}/library/${id}`,
	},
	template: {
		list: `/${path.api}/templates`, // ok
		save: `/${path.api}/template/save`, // ok
		update: `/${path.api}/template/update`, // ok
		get: (id: string | number) => `/${path.api}/template/id/${id}?lang=ko`, //ok
		remove: (id: string | number) => `/${path.api}/template/${id}`, // ok
	},
	category: {
		root: `/${path.api}/category`, // ok
		save: `/${path.api}/category/save`, // ok
		list: `/${path.api}/categories`, // ok
		library: `/${path.api}/categories/library`, // ok
		template: `/${path.api}/categories/template`, // ok
		remove: (id: string | number) => `/${path.api}/category/${id}`, // ok
	},
	request: {
		root: `/${path.api}/request`,
		products: `/${path.api}/request/products`,
		comment: `/${path.api}/request/products/comment`,
		list: `/${path.api}/request/list`,
	},
	faq: {
		list: `/${path.api}/faqs`, // ok
		update: `/${path.api}/faq`, // ok
		save: `/${path.api}/faq/save`, // ok
		remove: (id: string | number) => `/${path.api}/faq/${id}`, // ok
	},
	qna: {
		list: `/${path.api}/qnas`, // ok
		update: `/${path.api}/qna`, // ok
		save: `/${path.api}/qna/save`, // ok
		remove: (id: string | number) => `/${path.api}/qna/${id}`, // ok

		result: `/${path.api}/contact/result`,
	},
	notice: {
		root: `/${path.api}/notice`, // ok
		save: `/${path.api}/notice/save`, // ok
		list: `/${path.api}/notices`, // ok
		remove: (id: string | number) => `/${path.api}/notice/${id}`, // ok
	},
	file: {
		upload: `/${path.api}/user/file/upload`,
	},
};

export default $api;
