import { AppConfigDataType, AppConfigResponse } from './app.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';

// 조회
export const useSelectAppConfig = (params: { group?: string; skey?: string }) => {
	return useSuspenseQuery({
		queryKey: ['APP-CONFIG-R01', params],
		queryFn: async (): Promise<AppConfigResponse> => {
			const main = await api.get(API.APP_CONFIG, { params });
			return main.data;
		},
	});
};

// 추가
export const useCreateAppConfig = () => {
	return useMutation({
		mutationKey: ['APP-CONFIG-C01'],
		mutationFn: async (data: AppConfigDataType) => {
			return await api.post(API.APP_CONFIG, data);
		},
	});
};

// 삭제
export const useDeleteAppConfig = () => {
	return useMutation({
		mutationKey: ['APP-CONFIG-D01'],
		mutationFn: async (rowid: number) => {
			return await api.delete(API.APP_CONFIG, { params: { rowid } });
		},
	});
};

// 수정
export const useUpdateAppConfig = () => {
	return useMutation({
		mutationKey: ['APP-CONFIG-U01'],
		mutationFn: async (data: AppConfigDataType) => {
			return await api.put(API.APP_CONFIG, data);
		},
	});
};
