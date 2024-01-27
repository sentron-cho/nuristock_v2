import { $api } from '@/request/paths';
import axios, { AxiosError, Method } from 'axios';
import { IRequestConfig } from './useRequest';
import { useState } from 'react';
import useAlert from './useAlert';
import useLoading from './useLoading';
import Session from '@/store/Session';
import { str } from '@/langs/common.langs';
import api from '@/request/apis';

export default function useUpload<T>(): [
	T | null,
	(
		url: string,
		files: Array<any>,
		config?: IRequestConfig
	) => Promise<{
		isok: boolean;
		data: unknown;
		error: unknown;
		onUploadProgress?: (event: any) => void;
	}>,
	AxiosError | null
] {
	const [response, setResponseData] = useState<T | null>(null);
	const [error, setError] = useState<AxiosError | null>(null);
	const { showAlertError, showAlertSuccess } = useAlert();
	const { onLoading } = useLoading();

	// const upload = (
	//   file: File,
	//   onUploadProgress?: (event: any) => void
	// ): Promise<any> => {
	//   let formData = new FormData();

	//   formData.append('file', file);

	//   return axios.post($api.file.upload, formData, {
	//     headers: {
	//       'Content-Type': 'multipart/form-data',
	//     },
	//     onUploadProgress,
	//   });
	// };

	const setUpload = async (
		url: string,
		files: Array<any>,
		config?: IRequestConfig
		// onUploadProgress?: (event: any) => void
	) => {
		// config에 일단 기본값 설정 후 넘겨진 값 덮음
		const defaultConfig = {
			useLoading: true,
			useShowMessage: { success: false, error: true },
		};

		config = {
			...defaultConfig,
			...config,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			// onUploadProgress: onUploadProgress,
		};

		// 인증 토큰
		const { accessToken } = Session.getAuthroization();
		if (accessToken) {
			axios.defaults.headers.common['X-Auth-Token'] = accessToken;
		} else {
			axios.defaults.headers.common['X-Auth-Token'] = null;
		}

		const show = config.useShowMessage; // 성공/실패 메시지 표시 여부
		const isLoading = config.useLoading; // 로딩바 표시 여부

		let isok = false;
		let data: unknown = null;
		let error: unknown = null;

		try {
			if (isLoading) onLoading(true);
			isok = true;
			// const { data } = config as { data: Record<string, string> };
			const formData = new FormData();
			// files?.map(file => { })
			formData.append('file', files[0]);

			console.log('[useUpload]', formData);
			const res = (await api.post(
				url || $api.file.upload,
				{ userId: Session.getUserId(), files: files },
				config,
				false
			)) as any;
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
			return {
				isok: isok,
				data: data,
				error: error,
				onUploadProgress: config?.onUploadProgress,
			};
		}
	};

	return [response, setUpload, error];
}
