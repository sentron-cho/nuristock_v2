export const view = {
	title: {
		recent: '최근 작업',
		favorite: '즐겨찾기',
		membership: '사용자관리',
		privacy: '개인정보처리방침',
		service: '서비스이용약관',
	},
};

export const dashboard = {
	title: {
		create: '보드 만들기',
		recommend: '추천 템플릿',
		recent: '최근 작업',
	},
	label: {
		new_template: '새로 만들기',
	},
	placeholder: {},
	validation: {},
	alert: {},
	button: {
		new: '새로 만들기',
	},
	link: {
		templates: '모두보기',
	},
};

export const membership = {
	title: {
		create: '사용자 관리',
	},
	table: {
		no: '번호',
		name: '사용자이름',
		id: '사용자 아이디',
		role: '유형',
		status: '상태',
		creDate: '가입일',
		expDate: '구독만료일',
		edit: '관리',
	},
	label: {},
	placeholder: {},
	validation: {},
	alert: {
		not_remove: '본인 계정은 삭제할 수 없습니다.',
		remove: '사용자가 삭제되었습니다.',
		exp_date: '구독만료일을 입력하세요.',
	},
	button: {
		edit: '편집',
		remove: '삭제',
	},
	link: {},
};

export const favorite = {
	title: {
		favorite: '즐겨찾기',
	},
	alert: {
		favorite_uncheck: '즐겨찾기가 해제되었습니다.',
	},
};

export const library = {
	title: {
		library: '라이브러리',
	},
	table: {
		no: '번호',
		image: '썸네일',
		user: '사용자',
		type: '유형',
		category: '카테고리',
		name: '이름',
		tag: '태그',
		favorite: '즐겨찾기',
		share: '공개',
		edit: '관리',
	},
	label: {},
	placeholder: {},
	validation: {},
	alert: {
		library: '라이브러리가 등록 되었습니다.',
	},
	confirm: {
		title: '라이브러리 공개',
		text: '라이브러리를 공개합니다. 저작권에 주의해 주세요.',
	},
	button: {
		edit: '편집',
		remove: '삭제',
		share: '공개',
	},
	link: {},
	modal: {
		title: '라이브러리 등록',
		category: '카테고리',
		subject: '제목',
		file: '파일선택',
		check: '비율 조정 주의 알림',
		placeholder: {
			category: '카테고리를 선택하세요.',
			subject: '제목을 입력하세요.',
			file: '파일을 선택하세요.',
			template: '템플릿을 선택하세요.',
			thumbnail: '썸네일을 등록 하세요',
			type: '형식을 선택하세요',
			size: '사이즈를 선택하세요',
			tag: '태그를 입력하세요',
		},
	},
};

export const request = {
	title: {
		request: '제작요청',
		list: '요청내역',
		confirm: '알림',
		subject: '제목',
		content: '내용',
		files: '첨부파일',
		selection: '선택 상품',
		resFile: '제작파일',
		resComment: '제작 코멘트',
	},
	table: {
		no: '번호',
		product: '상품',
		title: '제목',
		reqDate: '요청일시',
		status: '작업상태',
		edit: '관리',
	},
	label: {
		selection: '제작 요청할 상품을 선택하세요.',
	},
	placeholder: {
		subject: '제목을 입력하세요.',
		content: '내용을 입력하세요.',
		comment: '제작자에게 코멘트를 남겨주세요.',
	},
	validation: {},
	alert: {
		payment: '제작을 요청하였습니다.',
	},
	button: {
		edit: '편집',
		remove: '삭제',
		request: '제작 요청 하기',
		payment: '결제하기',
		show: '작업보기',
	},
	link: {},
};

export const faq = {
	title: {
		faq: '자주하는 질문',
		subject: '제목',
		content: '내용',
	},
	table: {
		no: '번호',
		title: '제목',
		edit: '관리',
	},
	label: {},
	placeholder: {
		subject: '제목을 입력하세요.',
		content: '내용을 입력하세요.',
	},
	validation: {},
	alert: {},
	button: {
		edit: '편집',
		remove: '삭제',
		share: '공개',
	},
	confirm: {
		title: (isShare = true) => `${isShare ? '공개' : '비공개'}`,
		content: (isShare = true) =>
			`정말로 ${isShare ? '공개' : '비공개'}로 설정 하시겠습니까?`,
	},
	link: {},
};

export const modal = {
	template: {
		title: '',
		label: '모든 템플릿',
		placeholder: '템플릿을 검색 하세요',
		filteredResult: '검색 결과',
	},
	member: {
		title: {
			new: '추가',
			edit: '편집',
			additional_info: '추가정보 입력(선택)',
		},
		placeholder: {
			exp_date: '만료일',
		},
		label: {
			exp_date: '구독만료일',
			membership: '구독회원',
			additional_info: '추가 정보를 입력해 주세요.',
		},
	},
};

export const contact = {
	title: {
		contact: '문의하기',
		show: '문의보기',
		subject: '제목',
		content: '내용',
		result: '답변',
	},
	table: {
		no: '번호',
		category: '카테고리',
		title: '제목',
		status: '상태',
		edit: '관리',
	},
	label: {},
	placeholder: {
		subject: '제목을 입력하세요.',
		content: '내용을 입력하세요.',
		category: '카테고리를 선택하세요.',
		result: '답변을 입력하세요.',
	},
	validation: {},
	alert: {},
	button: {
		edit: '편집',
		remove: '삭제',
		share: '공개',
	},
	link: {},
};

export const setting = {
	title: {
		category: '카테고리 설정',
		library: '사용자 라이브러리',
		package: '구독 패키지 설정',
	},
	table: {
		no: '번호',
		type: '유형',
		title: '카테고리 이름',
		edit: '관리',
	},
	label: {
		selection: '제작 요청할 상품을 선택하세요.',
	},
	placeholder: {
		subject: '제목을 입력하세요.',
		content: '내용을 입력하세요.',
		comment: '제작자에게 코멘트를 남겨주세요.',
	},
	validation: {},
	alert: {
		payment: '제작을 요청하였습니다.',
	},
	button: {
		edit: '편집',
		remove: '삭제',
		request: '제작 요청 하기',
		payment: '결제하기',
		show: '작업보기',
	},
	modal: {
		category: {
			title: '카테고리 등록',
			subject: '카테고리 이름',
			placeholder: {
				subject:
					'카테고리 제목을 입력하세요, 콤마로 구분하여 다중 생성이 가능합니다.',
			},
		},
		alert: {
			category: '카테고리 제목을 입력하세요.',
		},
	},
};

export const template = {
	modal: {
		title: '템플릿',
		category: '카테고리',
		subject: '제목',
		file: '파일선택',
		check: '프리미엄 전용',
		placeholder: {
			category: '카테고리를 선택하세요.',
			subject: '제목을 입력하세요.',
			thumbnail: '썸네일을 등록 하세요',
			media: '매체를 선택하세요',
			type: '형식을 선택하세요',
			size: '사이즈를 선택하세요',
			tag: '태그를 입력하세요',
		},
	},
};

export const editor = {
	title: {
		category: '카테고리',
	},
	label: {
		new_template: '제목 없음',
	},
	placeholder: {
		title: '제목 없음',
		search: '라이브러리 검색',
		nosearch: '라이브러리가 없습니다.',
	},
	validation: {},
	alert: {},
	button: {},
	modal: {},
};

export const notices = {
	title: {
		create: '공지 사항',
	},
	table: {
		no: '번호',
		name: '제목',
		content: '내용',
		regDate: '수정일',
		edit: '관리',
	},
	label: {},
	placeholder: {},
	validation: {},
	alert: {},
	button: {
		edit: '편집',
		remove: '삭제',
	},
	link: {},
};
