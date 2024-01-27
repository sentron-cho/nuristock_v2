import { toObjectKeys } from '@/utils/utils';
import { IJsonData } from './interfaces';
export type DefaultType = 'success' | 'fail';
export type DefaultAlign = 'left' | 'right' | 'center';

export type AlertType = DefaultType;
export type AlertAlign = DefaultAlign;

export enum EditTarget {
	recommend = 'recommend', // 추천 템플릿
	recent = 'recent', // 최근 템플릿
	favorite = 'favorite',
	template = 'template', // 템플릿
	editing = 'editing', // 에디터중인 데이터
	library = '',
}

export enum UserType {
	none = '', // 없음 (0)
	professor = 'professor', // 교수 (10)
	researcher = 'researcher', // 연구원 (20)
	student = 'student', // 학생 (30)
	other = 'other', // 직접선택 (40) ??
}

export const ValueOfUserType = {
	none: '', // 없음
	professor: '교수', // 교수
	researcher: '연구원', // 연구원
	student: '학생', // 학생
	other: '직접선택', // 직접선택
};

export enum UserRole {
	admin = 'ROLE_ADMIN', // 관리자
	user = 'ROLE_USER', // 사용자
	member = 'ROLE_MEMBER', // 구독회원
}

export const ValueOfUserRole = {
	ROLE_ADMIN: '관리자', // 관리자
	ROLE_USER: '사용자', // 사용자
	ROLE_MEMBER: '구독회원', // 구독회원
};

export enum LibraryType {
	all = 'all', // 모두
	template = 'template', // 템플릿
	image = 'image', // 이미지
	clipart = 'clipart', // 클립아트
	modeling = 'modeling', // 3D
	graph = 'graph', // 그래프
}

export const ValueOfLibraryType = {
	all: '모두',
	template: '템플릿',
	image: '이미지',
	clipart: '클립아트',
	modeling: '3D',
	graph: '그래프',
};

export enum UserStatus {
	enable = 'enable', // 정상
	disable = 'disable', // 계정정지
}

export const ValueOfUserStatus = {
	enable: '정상', // 정상
	disable: '계정정지', // 계정정지
};

export enum RequestStatus {
	ready = 'ready', // 대기중
	working = 'working', // 처리중
	finished = 'finished', // 처리완료
}

export const ValueOfRequestStatus = {
	ready: '대기중', // 대기중
	working: '처리중', // 처리중
	finished: '처리완료', // 처리완료
};

export enum ContactStatus {
	ready = '1', // 대기중
	working = '2', // 처리중
	finished = '3', // 처리완료
}

export const ValueOfContactStatus = {
	'1': '대기중', // 대기중
	'2': '처리중', // 처리중
	'3': '처리완료', // 처리완료
};

export enum ContactCategories {
	use = '1', // 이용문의
	pqyment = '2', // 결제/환불
	general = '3', // 일반문의
}

export const ValueOfContactCategories = {
	'1': '이용문의', // 이용문의
	'2': '결제/환불', // 결제/환불
	'3': '일반문의', // 일반문의
};

const Career = (objects: IJsonData) => {
	let values = { ...objects } as IJsonData;

	return {
		get: (): IJsonData => values,
		getValue: (key: string | number): string => {
			if (typeof key === 'string') {
				return key;
			} else if (typeof key === 'number') {
				return Object.keys(values)[key];
			} else {
				return '';
			}
		},
		getLabel: (key: string | number): string => {
			if (typeof key === 'string') {
				return (values as IJsonData)[key];
			} else if (typeof key === 'number') {
				const k = Object.keys(values)[key];
				return k in values ? (values as IJsonData)[k as string] : values.mac1;
			} else {
				return '';
			}
		},
		getItem: (key: string): IJsonData | null => {
			if (typeof key === 'string') {
				return { value: key, label: (values as IJsonData)[key] };
			} else {
				return null;
			}
		},
		toSelectData: () => {
			return [
				...toObjectKeys(values).map((key) => ({
					label: values[key],
					value: key,
				})),
			];
		},
	};
};

export const MajorCareer = () => {
	const values = {
		mac1: '전공분야1',
		mac2: '전공분야2',
		mac3: '전공분야3',
		mac4: '전공분야4',
		mac5: '전공분야5',
	};

	const carrer = Career(values);

	return {
		get: carrer.get,
		getValue: carrer.getValue,
		getLabel: carrer.getLabel,
		getItem: carrer.getItem,
		toSelectData: () => {
			return [{ value: '', label: '전공분야 선택' }, ...carrer.toSelectData()];
		},
	};
};

export const MinorCareer = () => {
	let values = {
		mic1: '관심분야1',
		mic2: '관심분야2',
		mic3: '관심분야3',
		mic4: '관심분야4',
		mic5: '관심분야5',
	} as IJsonData;

	const carrer = Career(values);

	return {
		get: carrer.get,
		getValue: carrer.getValue,
		getLabel: carrer.getLabel,
		getItem: carrer.getItem,
		toSelectData: () => {
			return [{ value: '', label: '관심분야 선택' }, ...carrer.toSelectData()];
		},
	};
};
