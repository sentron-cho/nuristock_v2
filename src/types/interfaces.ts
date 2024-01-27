import { AxiosError } from 'axios';
import {
	ContactStatus,
	LibraryType,
	RequestStatus,
	UserRole,
	UserType,
} from './types';
import { NonDeletedExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { BinaryFileData } from '@excalidraw/excalidraw/types/types';

export interface IJsonData extends Record<string, string> {}
export interface IDefault {
	id?: string;
	title: string;
	image?: string;
	creDate?: string;
	regDate?: string;
}

export interface IRecent extends IDefault {
	favorite: boolean;
	message?: string;
}

export interface ISubscribtionItem extends IDefault {
	name: string;
	guide: string;
	text: string;
	price: string;
	data: string;
	count: string;
	time: string;
}

export interface INotice extends IDefault {
	content: string;
}

export interface IPrivacyAgree {
	service: boolean;
	privacy: boolean;
	info: boolean;
}

export interface IMembershipCheck extends ILogin {
	userName: string;
	passwordCheck: string;
}

export interface ICodeCheck {
	code: string;
}

export interface IAxiosException extends AxiosError {
	statusCode?: string;
	data?: IJsonData;
}

export interface IDrawData {
	type: string;
	version: number;
	source: string;
	elements: readonly NonDeletedExcalidrawElement[];
	files?: BinaryFileData[];
}

// export interface IDrawItem extends IDefault {
// 	categoryId: string;
// 	premium: boolean;
// 	favorite: boolean;
// 	tag: string;
// 	data?: IDrawData;
// 	message?: string;
// }

export interface ICategory extends IDefault {
	type: LibraryType;
	favorite: boolean;
	templates: ITemplate[];
}

// export interface ICategoryList extends ICategory {
// 	list: Array<IRecent>;
// }

export interface ITemplate extends IDefault {
	categoryId: string;
	premium: boolean;
	favorite: boolean;
	tag: string;
	data?: IDrawData;
	message?: string;
	recommed?: boolean;
	owner: string;
}

export interface ILibraryData {
	mimeType: string;
	dataURL: string;
	size: number;
	width: number;
	height: number;
	created: string;
	templateId?: string;
	elements?: any;
}

export interface ILibrary extends IDefault {
	type: LibraryType;
	userRole?: string;
	categoryId: string;
	premium: boolean;
	favorite: boolean;
	tag: string;
	message?: string;
	recommed?: boolean;
	owner: string;
	data?: ILibraryData;
	style: string;
	size: string;
	showYn: 'Y' | 'N';
}

export interface ILibraryCategory extends IDefault {
	type: LibraryType;
	favorite: boolean;
	librarys: ILibrary[];
}

export interface IProductItem extends IDefault {
	price: string;
	label: string;
}

export interface IRequestItem extends IDefault {
	productId: string;
	productTitle: string;
	text?: string;
	files?: string;
	resFiles?: string;
	comment?: string;
	status: RequestStatus;
}

export interface IFaqItem extends IDefault {
	text?: string;
	owner?: string;
	showYn: 'Y' | 'N';
}

export interface IContactItem extends IDefault {
	categoryId?: string;
	text?: string;
	status: ContactStatus;
	result?: string;
	owner?: string;
	showYn: 'Y' | 'N';
}

export interface IMemberAdditionInfo {
	jobType?: UserType; // 직업
	majorCareer?: string; // 전공분야
	minorCareer?: string; // 관심분야
}

export interface ILogin {
	email?: string;
	password?: string;
}

export interface IData {
	id?: string; // 고유키
	creDate?: string; // 생성일
	regDate?: string; // 수정일
}

export interface IAvaterFileDetail extends IData {
	userId: string; // 사용자 아이디
	path: string; // 썸네일 패스
	fileType?: string; // 파일 타입
}

export interface IUser extends IMemberAdditionInfo, IData, ILogin {
	name?: string; // 이름
	nickName?: string; // 닉네임
	avatarFileDetail?: IAvaterFileDetail; // 사용자 아바타 정보

	provider?: string; // 제공자??
	authorities?: Array<Record<string, string>>;

	role?: UserRole; // 유형(관리자, 일반회원, 구독회원)
	status?: 'enable' | 'disable'; // 상태(정상, 계정정지)
	expDate?: string; // 구독만료일
}

export interface IPostion {
	x: number;
	y: number;
}
