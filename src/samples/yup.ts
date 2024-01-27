import * as yup from 'yup';

const schema = yup.object().shape({
	nickname: yup
		.string()
		.min(2, '닉네임은 최소 2글자 이상입니다!')
		.max(10, '닉네임은 최대 10글자입니다!')
		.matches(
			/^[가-힣a-zA-Z][^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
			'닉네임에 특수문자가 포함되면 안되고 숫자로 시작하면 안됩니다!'
		)
		.required('닉네임을 입력해주세요'),
	// checkNickname: yup.boolean().required('중복체크해주세요'),
	id: yup
		.string()
		.min(3, '3자 이상 입력해주세요!')
		.matches(
			/^[가-힣a-zA-Z][^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
			'닉네임에 특수문자가 포함되면 안되고 숫자로 시작하면 안됩니다!'
		)
		.required('아이디를 입력해주세요'),
	pw: yup
		.string()
		.max(16, '비밀번호는 최대 16자리입니다!')
		.matches(
			/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}[^\s]*$/,
			'알파벳, 숫자, 공백을 제외한 특수문자를 모두 포함한 8자리 이상 입력해주세요'
		)
		// .matches(regexPasswd, '비밀번호를 8~16자로 영문 대소문자, 숫자, 특수기호를 조합해서 사용하세요.')
		.required('비밀번호를 입력해주세요'),
	checkPw: yup
		.string()
		.oneOf([yup.ref('pw'), null], '비밀번호가 일치하지 않습니다')
		.required('비밀번호를 한번 더 입력해주세요'),
	certifi_email: yup
		.string()
		.email('이메일형식이 적합하지 않습니다.')
		.required('이메일 인증해주세요'),
});
