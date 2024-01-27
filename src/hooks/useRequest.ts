import { $api } from '@/request/paths';
import useAlert from '@/hooks/useAlert';
import { str } from '@/langs/common.langs';
import api from '@/request/apis';
import Session from '@/store/Session';
import {
	ICategory,
	IContactItem,
	IFaqItem,
	IJsonData,
	ILibrary,
	ITemplate,
	IUser,
} from '@/types/interfaces';
import { LibraryType, UserRole, UserStatus, UserType } from '@/types/types';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import useLoading from './useLoading';

export enum Method {
	POST = 'post',
	GET = 'get',
	DELETE = 'delete',
	PUT = 'put',
}

export const THUMB_PREFIX = 'http://scidraw.orangegear.co.kr/files';

export const Values = {
	toImageUrl: (url: string) => {
		if (url.startsWith('http')) return url;
		else return `${THUMB_PREFIX}${url}`;
	},

	toUserRole: (roles: string[]): UserRole => {
		// roles: ["ROLE_USER","ROLE_ADMIN"],
		if (!roles || roles.length <= 0) {
			console.warn('is not user roles! => ', roles);
			return UserRole.user;
		} else if (roles.length === 1) return roles[0] as UserRole;
		else {
			if (roles.includes(UserRole.admin)) return UserRole.admin;
			if (roles.includes(UserRole.member)) return UserRole.member;
			else return UserRole.user;
		}
	},

	toJobType: (value: string): UserType => {
		// "level":  10: 교수, 20: 연구자, 30:학생
		const items: IJsonData = {
			'0': UserType.none,
			'10': UserType.professor,
			'20': UserType.researcher,
			'30': UserType.student,
			'40': UserType.other,
		};

		// 사용자 타입이 없으면 기본값(UserType.none)
		if (!value) {
			console.warn(
				'is not user job type is null',
				`from level = ${value} to type = ''}`
			);
			return items['0'] as UserType;
		}

		const type = items[value] as UserType;
		// 사용자 타입 변환 오류면 기타(UserType.other)
		if (!type) {
			console.warn(
				'is not user job type! => ',
				`from level = ${value} to type = ${items['40']}`
			);
			return items['40'] as UserType;
		}

		return type;
	},

	toCategoryType: (value: string): LibraryType => {
		// "division":  카테고리 유형(1: 템플릿, 2: 이미지, 3: 클립아트, 4: 3D)
		const items: IJsonData = {
			'1': LibraryType.template,
			'2': LibraryType.image,
			'3': LibraryType.clipart,
			'4': LibraryType.modeling,
		};

		// 타입이 없으면 기본값(UserType.none)
		if (!value) {
			console.warn(
				'is not category type is null',
				`from division = ${value} to type = ''}`
			);
			return items['0'] as LibraryType;
		}

		const type = items[value] as LibraryType;
		// 타입 변환 오류면 기타(UserType.other)
		if (!type) {
			console.warn(
				'is not category type! => ',
				`from division = ${value} to type = ${items['40']}`
			);
			return items['1'] as LibraryType;
		}

		return type;
	},

	toLibraryType: (value: string): LibraryType => {
		// "division":  카테고리 유형(1: 템플릿, 2: 이미지, 3: 클립아트, 4: 3D)
		const items: IJsonData = {
			'1': LibraryType.template,
			'2': LibraryType.image,
			'3': LibraryType.clipart,
			'4': LibraryType.modeling,
		};

		// 타입이 없으면 기본값(UserType.none)
		if (!value) {
			console.warn(
				'is not category type is null',
				`from division = ${value} to type = ''}`
			);
			return items['0'] as LibraryType;
		}

		const type = items[value] as LibraryType;
		// 타입 변환 오류면 기타(UserType.other)
		if (!type) {
			console.warn(
				'is not category type! => ',
				`from division = ${value} to type = ${items['40']}`
			);
			return items['1'] as LibraryType;
		}

		return type;
	},

	toBoolean: (value: '0' | '1' | number): boolean => {
		return String(value) === '1';
	},

	toShowYn: (value: '0' | '1' | number): 'Y' | 'N' => {
		return String(value) === '1' ? 'Y' : 'N';
	},

	fromJobType: (value: UserType): string => {
		// "level":  10: 교수, 20: 연구자, 30:학생
		const items: IJsonData = {
			[UserType.none]: '0',
			[UserType.professor]: '10',
			[UserType.researcher]: '20',
			[UserType.student]: '30',
			[UserType.other]: '40',
		};

		return items[value];
	},

	fromCategoryType: (value: LibraryType): string => {
		// "division":  카테고리 유형(1: 템플릿, 2: 이미지, 3: 클립아트, 4: 3D)
		const items: IJsonData = {
			[LibraryType.template]: '1',
			[LibraryType.image]: '2',
			[LibraryType.clipart]: '3',
			[LibraryType.modeling]: '4',
		};

		return items[value];
	},

	fromLibraryType: (value: LibraryType): string => {
		// "division":  카테고리 유형(1: 템플릿, 2: 이미지, 3: 클립아트, 4: 3D)
		// if (!value || value === LibraryType.all) return '';

		const items: IJsonData = {
			[LibraryType.template]: '1',
			[LibraryType.image]: '2',
			[LibraryType.clipart]: '3',
			[LibraryType.modeling]: '4',
		};

		return items[value];
	},

	fromBoolean: (value: boolean): '0' | '1' => {
		return value ? '1' : '0';
	},

	fromShowYn: (value: 'Y' | 'N'): '1' | '0' => {
		return value === 'Y' ? '1' : '0';
	},
};

export const Parser = {
	userInfo: (data: any) => {
		const parseData: IUser = {
			id: data?.id, // 아이디
			email: data?.email, // 이메일
			name: data?.name,
			nickName: data?.nickname,
			password: data?.password, // 비밀번호
			creDate: data?.createdAt, // 생성일
			regDate: data?.modifiedAt, // 수정일
			jobType: Values.toJobType(data?.level), // 직업
			majorCareer: data?.major, // 전공분야
			minorCareer: data?.interests, // 관심분야
			role: Values.toUserRole(data?.roles), // 유형(관리자, 일반회원, 구독회원)
			status: Values.toBoolean(data?.status)
				? UserStatus.enable
				: UserStatus.disable, // 상태(enable : 정상, disable : 계정정지)
			expDate: '', // 구독만료일
			provider: data?.provider,
		};
		return parseData;
	},
	toUserInfo: (data: IUser) => {
		let toReq: any = {};
		data?.id && (toReq.id = data.id);
		data?.email && (toReq.email = data.email);
		data?.name && (toReq.name = data.name);
		data?.nickName && (toReq.nickname = data.nickName);
		data?.password && (toReq.password = data.password);
		data?.creDate && (toReq.createdAt = data.creDate);
		data?.regDate && (toReq.modifiedAt = data.regDate);
		data?.jobType && (toReq.level = Values.fromJobType(data.jobType));
		data?.majorCareer && (toReq.major = data.majorCareer);
		data?.minorCareer && (toReq.interests = data.minorCareer);
		data?.status &&
			(toReq.status = data.status === UserStatus.enable ? '1' : '0');
		// data?.role && (toReq.roles = data?.role)
		// data?.expDate && (toReq.expDate = data?.expDate)

		return toReq;
	},
	template: (data: any) => {
		const parseData: ITemplate = {
			id: data?.id,
			creDate: data?.createdAt,
			regDate: data?.modifiedAt,
			owner: data?.userId,
			categoryId: data?.categoryId,
			premium: Values.toBoolean(data?.premium),
			favorite: Values.toBoolean(data?.favorite),
			tag: data?.tag,
			title: data?.title,
			message: data?.message,
			recommed: data?.recommed,
			image: Values.toImageUrl(data?.thumbnailFilePath),
			data: data?.data,
		};
		return parseData;
	},
	toTemplate: (data: ITemplate) => {
		let toReq: any = {};
		data?.categoryId && (toReq.categoryId = data.categoryId);
		data?.data && (toReq.data = data.data);
		data?.favorite != undefined &&
			(toReq.favorite = Values.fromBoolean(data.favorite));
		data?.id && (toReq.id = data.id);
		data?.image && (toReq.image = data.image);
		data?.message && (toReq.message = data.message);
		data?.recommed != undefined &&
			(toReq.recommed = Values.fromBoolean(data.recommed));
		data?.premium != undefined &&
			(toReq.premium = Values.fromBoolean(data.premium));
		data?.tag && (toReq.tag = data.tag);
		data?.title && (toReq.title = data.title);
		data?.owner && (toReq.userId = data.owner);

		return toReq;
	},
	library: (data: any) => {
		const parseData: ILibrary = {
			id: data?.id,
			creDate: data?.createdAt,
			regDate: data?.modifiedAt,
			owner: data?.userId,
			categoryId: data?.categoryId,
			premium: Values.toBoolean(data?.premium),
			favorite: Values.toBoolean(data?.favorite),
			tag: data?.tag,
			title: data?.title,
			message: data?.message,
			recommed: data?.recommed,
			image: Values.toImageUrl(data?.thumbnailFilePath),
			data: data?.data,
			type: Values.toLibraryType(data?.division),
			showYn: Values.toShowYn(data?.publish),
			style: '',
			size: '',
		};
		return parseData;
	},
	toLibrary: (data: ILibrary) => {
		let toReq: any = {};
		data?.categoryId && (toReq.categoryId = data.categoryId);
		data?.data && (toReq.data = data.data);
		data?.favorite != undefined &&
			(toReq.favorite = Values.fromBoolean(data.favorite));
		data?.id && (toReq.id = data.id);
		data?.type && (toReq.division = Values.fromLibraryType(data.type));
		data?.image && (toReq.image = data.image);
		data?.showYn && (toReq.publish = Values.fromShowYn(data.showYn));
		data?.tag && (toReq.tag = data.tag);
		data?.title && (toReq.title = data.title);
		data?.owner && (toReq.userId = data.owner);

		return toReq;
	},
	category: (data: any) => {
		const parseData: ICategory = {
			id: data?.id,
			title: data?.title,
			type: Values.toCategoryType(data?.division),
			favorite: Values.toBoolean(data?.favorite),
			regDate: data?.modifiedAt,
			templates: data?.templates.map((a: any) => Parser.template(a)),
		};
		return parseData;
	},
	toCategory: (data: ICategory) => {
		let toReq: any = {};
		data?.id && (toReq.id = data.id);
		data?.title && (toReq.title = data.title);
		data?.favorite != undefined && (toReq.favorite = data.favorite);
		data?.regDate && (toReq.modifiedAt = data.regDate);
		data?.type && (toReq.division = Values.fromCategoryType(data.type));
		// data?.templates && (toReq.templates = data?.templates); // 수정 불가

		return toReq;
	},
	faq: (data: any) => {
		const parseData: IFaqItem = {
			id: data?.id,
			creDate: data?.createdAt,
			regDate: data?.modifiedAt,
			text: data?.content,
			showYn: Values.toShowYn(data?.publish),
			title: data?.title,
		};
		return parseData;
	},
	toFaq: (data: IFaqItem) => {
		let toReq: any = {};
		data?.id && (toReq.id = data.id);
		data?.title && (toReq.title = data.title);
		data?.text && (toReq.content = data.text);
		data?.creDate && (toReq.createdAt = data.creDate);
		data?.regDate && (toReq.modifiedAt = data.regDate);
		data?.showYn && (toReq.publish = Values.fromShowYn(data.showYn));
		data?.owner && (toReq.userId = data.owner);
		return toReq;
	},
	qna: (data: any) => {
		const parseData: IContactItem = {
			id: data?.id,
			creDate: data?.createdAt,
			regDate: data?.modifiedAt,
			categoryId: data?.categoryId,
			text: data?.content,
			status: data?.status,
			showYn: Values.toShowYn(data?.publish),
			title: data?.title,
		};
		return parseData;
	},
	toQna: (data: IContactItem) => {
		let toReq: any = {};
		data?.id && (toReq.id = data.id);
		data?.categoryId && (toReq.categoryId = data.categoryId);
		data?.title && (toReq.title = data.title);
		data?.text && (toReq.content = data.text);
		data?.creDate && (toReq.createdAt = data.creDate);
		data?.regDate && (toReq.modifiedAt = data.regDate);
		data?.text && (toReq.content = data.text);
		data?.showYn && (toReq.publish = Values.fromShowYn(data.showYn));
		data?.owner && (toReq.userId = data.owner);
		data?.status && (toReq.status = data.status);
		data?.result && (toReq.answer = data.result);
		return toReq;
	},
	userInfoList: (list: any) => {
		return list.map((data: any) => {
			return Parser.userInfo(data);
		});
	},
	templateList: (list: any) => {
		return list.map((data: any) => {
			return Parser.template(data);
		});
	},
	categoryList: (list: any) => {
		return list.map((data: any) => {
			return Parser.category(data);
		});
	},
	libraryList: (list: any) => {
		return list.map((data: any) => {
			return Parser.library(data);
		});
	},
	faqList: (list: any) => {
		return list.map((data: any) => {
			return Parser.faq(data);
		});
	},
	qnaList: (list: any) => {
		return list.map((data: any) => {
			return Parser.qna(data);
		});
	},
};

export interface IShowMessage {
	success?: boolean;
	error?: boolean;
}

export interface IRequestConfig extends AxiosRequestConfig<any> {
	useLoading?: boolean; // dafault = true
	useParsing?: boolean; // default = true
	useShowMessage?: IShowMessage; // default = { success: false, error: true }
}

export default function useRequest<T>(): [
	T | null,
	(
		method: Method.GET | Method.POST | Method.PUT | Method.DELETE,
		url: string,
		config?: IRequestConfig
	) => Promise<{ isok: boolean; data: unknown; error: unknown }>,
	AxiosError | null
] {
	const [response, setResponseData] = useState<T | null>(null);
	const [error, setError] = useState<AxiosError | null>(null);
	const { showAlertError, showAlertSuccess } = useAlert();
	const { onLoading } = useLoading();

	const setRequest = async (
		method: Method.GET | Method.POST | Method.PUT | Method.DELETE = Method.GET,
		url: string,
		config?: IRequestConfig
	) => {
		// config에 일단 기본값 설정 후 넘겨진 값 덮음
		const defaultConfig = {
			useLoading: true,
			useParsing: true,
			useShowMessage: { success: false, error: true },
		};

		config = {
			...defaultConfig,
			...config,
		};

		// 인증 토큰
		const { accessToken } = Session.getAuthroization();
		if (accessToken) {
			axios.defaults.headers.common['X-Auth-Token'] = accessToken;
		} else {
			axios.defaults.headers.common['X-Auth-Token'] = null;
		}

		const show = config.useShowMessage; // 성공/실패 메시지 표시 여부
		const isParse = config.useParsing; // 수신 데이터 파싱 여부
		const isLoading = config.useLoading; // 로딩바 표시 여부

		let isok = false;
		let data: unknown = null;
		let error: unknown = null;

		try {
			let res: any;

			if (isLoading) onLoading(true);

			if (method === Method.GET) res = await get(url, config);
			else if (method === Method.POST) {
				const data = withParserParams(url, config?.data, isParse);
				console.log(data);

				res = await post(url, { ...config, data: data });
			} else if (method === Method.PUT) {
				const params = withParserParams(url, config?.params, isParse);
				console.log(params);

				res = await put(url, { ...config, params: params });
			} else if (method === Method.DELETE) res = await remove(url, config);

			isok = true;

			if (method === Method.DELETE) {
				data = { ...res };
			} else {
				const parsedData = withParserData(
					url,
					res?.data || res?.list,
					isParse
				) as T;
				data = parsedData;
			}

			setResponseData(data as T);

			if (show?.success && res?.msg) {
				showAlertSuccess(res?.msg);
			}
		} catch (error) {
			show?.error && showAlertError(str.alert.error(error));
			setError(error as any);
			onLoading(false); // useLoading와 상관없이 오류 발생시 로딩바 강제 종료

			isok = false;
			error = error;
		} finally {
			if (isLoading) onLoading(false);
			return { isok: isok, data: data, error: error };
		}
	};

	const withParserData = (url: string, resData: any, isParsing = true) => {
		if (!isParsing) return resData;

		if (url === $api.member.list) return Parser.userInfoList(resData);
		if (url === $api.member.user(resData.id)) return Parser.userInfo(resData);
		if (url === $api.template.list) return Parser.templateList(resData);
		if (url === $api.category.list) return Parser.categoryList(resData);
		if (url === $api.category.template) return Parser.categoryList(resData);
		if (url === $api.category.root) return Parser.category(resData);
		if (url === $api.template.get(resData.id)) return Parser.template(resData);
		if (url === $api.library.list) return Parser.libraryList(resData);
		if (url === $api.library.all) return Parser.libraryList(resData);
		if (url === $api.faq.list) return Parser.faqList(resData);
		if (url === $api.qna.list) return Parser.qnaList(resData);
		else return resData;
	};

	const withParserParams = (url: string, params: any, isParsing = true) => {
		if (!isParsing) return params;

		if (url === $api.member.root) return Parser.toUserInfo(params);
		if (url === $api.auth.regist.user) return Parser.toUserInfo(params);
		if (url === $api.category.root) return Parser.toCategory(params);
		if (url === $api.category.save) return Parser.toCategory(params);
		if (url === $api.template.save) return Parser.toTemplate(params);
		if (url === $api.template.update) return Parser.toTemplate(params);
		if (url === $api.library.save) return Parser.toLibrary(params);
		if (url === $api.library.update) return Parser.toLibrary(params);
		if (url === $api.faq.save) return Parser.toFaq(params);
		if (url === $api.faq.update) return Parser.toFaq(params);
		if (url === $api.qna.save) return Parser.toQna(params);
		if (url === $api.qna.update) return Parser.toQna(params);
		else return params;
	};

	const get = async (url: string, config?: AxiosRequestConfig<any>) => {
		return await api.get(url, config);
	};

	const post = async (url: string, config?: AxiosRequestConfig<any>) => {
		const { data } = config as { data: Record<string, string> };
		return await api.post(url, data, config);
	};

	const put = async (url: string, config?: AxiosRequestConfig<any>) => {
		const { data } = config as { data: Record<string, string> };
		return await api.put(url, data, config);
	};

	const remove = async (url: string, config?: AxiosRequestConfig<any>) => {
		return await api.delete(url, config);
	};

	return [response, setRequest, error];
}
