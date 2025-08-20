import { DividendCreateType, DividendResponse } from './dividend.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';

// 조회
export const useSelectDividend = (code?: string) => {
	return useSuspenseQuery({
		queryKey: ['DIVIDEND-R01', code],
		queryFn: async (): Promise<DividendResponse> => {
			const main = await api.get(API.DIVIDEND, { params: { code } });
			return main.data;
		},
	});
};

// 추가
export const useCreateDividend = () => {
	return useMutation({
		mutationKey: ['DIVIDEND-C01'],
		mutationFn: async (data: DividendCreateType) => {
			return await api.post(API.DIVIDEND, data);
		},
	});
};

// 삭제
export const useDeleteDividend = () => {
	return useMutation({
		mutationKey: ['DIVIDEND-D01'],
		mutationFn: async (params: { rowid?: number; code?: string }) => {
			return await api.delete(API.DIVIDEND, { params });
		},
	});
};

// 수정
export const useUpdateDividend = () => {
	return useMutation({
		mutationKey: ['DIVIDEND-U01'],
		mutationFn: async (data: DividendCreateType) => {
			return await api.put(API.DIVIDEND, data);
		},
	});
};