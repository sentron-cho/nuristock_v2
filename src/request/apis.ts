import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const api = {
	get: async (url: string, config: AxiosRequestConfig<any> = {}) => {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.get(url, config);
				resolve(res.data);
			} catch (err) {
				console.log(err);
				// 에러 처리
				if (axios.isAxiosError(err)) {
					// 요청이 이루어졌고 서버가 응답했을 경우
					if (err.response) {
						const { status, config } = err.response;

						if (status === 404) {
							console.log(`${config.url} not found`);
						}
						if (status === 500) {
							console.log('Server error');
						}
					} else if (err.request) {
						// 요청이 이루어졌으나 서버에서 응답이 없었을 경우
						console.log('Error', err.message);
					} else {
						// 그 외 다른 에러
						console.log('Error', err.message);
					}

					reject(err);
				}
			}
		});
	},
	post: async (
		url: string,
		data?: object,
		config?: AxiosRequestConfig<any>
	) => {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.post(url, data, config);
				console.log(res);
				res?.status === 200 && res?.data?.success
					? resolve(res?.data)
					: reject(res?.data);
			} catch (err) {
				// 서버에서 메시지를 받으면 메시지를 바로 표시
				if (err instanceof AxiosError && err?.response?.data?.msg) {
					err.message = err.response.data.msg;
					return reject(err);
				}

				reject(err);
			}
		});
	},
	put: async <T>(
		url: string,
		data?: object,
		config?: AxiosRequestConfig<any>
	) => {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.put(url, data, config);
				resolve(res.data as T);
			} catch (err) {
				reject(err);
			}
		});
	},
	delete: async <T>(url: string, config?: AxiosRequestConfig<any>) => {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.delete(url, config);
				resolve(res.data as T);
			} catch (err) {
				reject(err);
			}
		});
	},
};

export default api;
