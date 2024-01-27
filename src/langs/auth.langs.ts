export const login = {
	title: '이메일로 로그인',
	label: {
		social: '또는 소셜로 로그인 하기',
		regist_check: '기억하기',
	},
	placeholder: {
		id: '아이디(이메일)를 입력하세요',
		password: '비밀번호를 입력하세요',
	},
	button: {
		login: '로그인',
		facebook: '페이스북',
		apple: '애플',
		google: '구글',
	},
	link: {
		recover: '아이디/비밀번호 찾기',
		regist: '회원가입',
	},
	validation: {
		email: {
			format: '이메일 형식이 올바르지 않습니다.',
			required: '아이디(이메일)를 입력해주세요',
		},
		password: {
			format: '비밀번호는 8-15자의 영어 소문자, 숫자 조합입니다.',
			required: '비밀번호를 입력해주세요',
		},
	},
	alert: {
		success: '로그인 성공',
		validate: '아이디 및 비밀번호를 입력하세요.',
		fail: '아이디 또는 비밀번호를 정확히 입력하세요.',
	},
};

export const register = {
	title: {
		membership: '회원가입',
		additional_info: '추가정보 입력(선택)',
	},
	label: {
		privacy: '이용약관 동의',
		check_all: '전체 약관 동의',
		check_service: '서비스 이용약관(필수)',
		check_privacy: '개인정보 처리방침(필수)',
		check_info: '광고성 정보 제공 동의(선택)',
		membership: '이메일 주소를 입력하고 Scidraw 서비스를 시작하세요.',
		additional_info: '추가 정보를 입력해 주세요.',
	},
	placeholder: {
		name: '사용자 이름을 입력해 주세요',
		email: '이메일 주소를 입력해 주세요',
		password: '비밀번호를 입력해 주세요',
		password_check: '비밀번호를 확인해 주세요',
	},
	button: {
		next: '다음',
		skip: '건너뛰기',
		ok: '확인',
	},
	alert: {
		fail: '저장에 실패하였습니다.',
		dup: '이미 가입된 아이디(이메일) 입니다..',
		success: '회원가입이 완료 되었습니다.',
		save: '추가정보 입력이 완료 되었습니다.',
	},
	dropmenu: {
		professor: '교수',
		researcher: '연구자',
		student: '학생',
		other: '직접등록',
	},
};

export const recover = {
	title: {
		password: '비밀번호 재설정',
		userid: '아이디 찾기',
	},
	label: {
		password: `가입시 등록하신 이메일을 통해 회원님의 비밀번호를 재설정 하실 수 있도록 도와 드리겠습니다.`,
		userid:
			'가입시 등록하신 이메일을 통해 회원님의 아이디를 찾아 드리겠습니다.',
		password_current: '현재 비밀번호 입력',
		password_new: '신규 비밀번호 입력',
		password_check: '비밀번호 입력 확인',
	},
	placeholder: {
		name: '사용자 이름을 입력해주세요.',
		email: '가입시 등록한 이메일 주소를 입력해 주세요',
		password_current: '현재 비밀번호를 입력해 주세요',
		password_new: '신규 비밀번호를 입력해 주세요',
		password_check: '비밀번호를 확인해 주세요',
	},
	alert: {
		failure: '현재 사용중인 비밀번호입니다.',
		success: '비밀번호 변경이 완료되었습니다.',
	},
	button: {
		ok: '확인',
		login: '로그인',
		email_check: '이메일 인증',
	},
};
