import { AxiosError } from 'axios';

export const str = {
	modal: {
		ok: '확인',
		cancel: '취소',
	},
	label: {
		no: '번호',
		management: '관리',
		edit: '수정',
		save: '저장',
	},
	button: {
		ok: '확인',
		cancel: '취소',
		next: '다음',
		prev: '이전',
		yes: '네',
		no: '아니오',
		remove: '삭제',
		new: '신규',
		add: '추가',
		edit: '편집',
		update: '수정',
		share: '공개',
		unshare: '비공개',
		save: '저장',
		download: '다운로드',
		upload: '업로드',
	},
	nodata: '데이터가 없습니다.',
	search: {
		nosearch: '검색 결과가 없습니다.',
		noitem: '항목이 없습니다.',
		notemplate: '등록된 템플릿이 없습니다.',
	},
	checkcode: {
		title: '인증 코드 확인',
		label: `회원 가입시 등록하신 이메일로 6자리의 숫자로 이루어진 인증코드를 보내드렸습니다. 이메일 확인후 인증 코드를 입력해주세요`,
		validation: {
			check: '인증코드가 일치하지 않습니다.',
			required: '인증코드 6자리를 입력해주세요.',
		},
		placeholder: '인증 코드를 입력 하세요',
		ok: '확인',
	},
	sample: {
		title: {},
		label: {},
		placeholder: {},
		validation: {},
		alert: {},
		button: {},
	},
	confirm: {
		title: {
			remove: '삭제',
			new: '신규',
			add: '추가',
			edit: '편집',
			update: '수정',
		},
		text: {
			remove: '정말로 삭제하시겠습니까?',
		},
	},
	alert: {
		save: '저장 되었습니다.',
		update: '수정 되었습니다.',
		remove: '삭제 되었습니다.',
		success: '처리 되었습니다.',
		fail: '처리에 실패 하였습니다.',
		noservice: '서비스 준비중입니다.',
		error: (error: any) => {
			if (error instanceof AxiosError) {
				return (
					error?.message ||
					(`처리중 알수 없는 오류가 발생했습니다` + error?.code &&
						`(${error?.code})`)
				);
			} else {
				return `처리중 알수 없는 오류가 발생했습니다.`;
			}
		},
		share: (showYn = 'Y') =>
			`${showYn === 'Y' ? '공개' : '비공개'}로 설정되었습니다`,
	},
	dropmenu: {
		recent: {
			copy: '복제',
			rename: '이름 바꾸기',
			thumbnail: '썸네일바꾸기',
		},
	},
};

export const validstr = {
	email: {
		check: '이미 사용중인 이메일 주소입니다.',
		format: '이메일 형식이 올바르지 않습니다.',
		required: '아이디(이메일)를 입력해주세요',
	},
	name: {
		check: '이미 사용중인 사용자 이름입니다.',
		required: '사용자 이름을 입력해주세요',
	},
	password: {
		format: '비밀번호는 8-15자의 영어 소문자, 숫자 조합입니다.',
		check: '비밀번호가 일치하지 않습니다.',
		required: '비밀번호를 입력해주세요',
	},
	code: {
		check: '인증코드가 일치하지 않습니다.',
		required: '인증코드 6자리를 입력해주세요.',
	},
	addinfo: {
		job: '직업을 선택하세요',
		major: '전공분야를 선택하세요.',
		minor: '관심분야를 선택하세요.',
	},
	membership: {
		name: '사용자 이름을 입력해주세요.',
		email: '아이디(이메일)를 입력해 주세요',
		password: '비밀번호를 입력해 주세요',
		password_current: '현재의 비밀번호를 입력해 주세요',
		password_new: '신규 비밀번호를 입력해 주세요',
		password_check: '비밀번호를 확인해 주세요',
	},
};
