import axios from 'axios';
import { ST } from '@shared/config/kor.lang';
import { toast } from './toast.config';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

const ERROR = {
	"ER_DUP_ENTRY" : '중복된 데이터 입니다.',
	"ER_NOT_ROWID" : '존재하지 않는 ROWID 입니다.',
} as Record<string, string>

// ✅ 공통 에러 처리 인터셉터
api.interceptors.response.use(
	(response) => response,
	(error) => {

		let msg = error?.message || ST.ERROR_PROBLEM;

		if (error?.response) {
			const { code, message } = error.response?.data;
			msg = ERROR?.[code] || message || error?.message;
		}

		// 공통 에러 로그 출력
		console.error('[Axios Error]', error);

		// 커스텀 toast 함수로 사용자에게 알림
		toast('error', msg);

		// 필요 시 특정 에러별 핸들링
		if (error.response?.status === 401) {
			console.warn('로그인이 필요합니다.');
			// router.push('/login') 등 가능
		}

		return Promise.reject(error); // 꼭 에러를 다시 throw 해야 `useMutation` 등에서 `onError`가 동작
	}
);

export default api;
