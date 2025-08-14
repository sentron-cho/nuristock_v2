import { DepositCreateType, DepositResponse } from './deposit.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';

// 조회
export const useSelectDeposit = (code?: string) => {
	return useSuspenseQuery({
		queryKey: ['DEPOSIT-R01', code],
		queryFn: async (): Promise<DepositResponse> => {
			const main = await api.get(API.DEPOSIT, { params: { code } });
			return main.data;
		},
	});
};

// 추가
export const useCreateDeposit = () => {
	return useMutation({
		mutationKey: ['DEPOSIT-C01'],
		mutationFn: async (data: DepositCreateType) => {
			return await api.post(API.DEPOSIT, data);
		},
	});
};

// 삭제
export const useDeleteDeposit = () => {
	return useMutation({
		mutationKey: ['DEPOSIT-D01'],
		mutationFn: async (rowid: number) => {
			return await api.delete(API.DEPOSIT, { params: { rowid } });
		},
	});
};

// 수정
export const useUpdateDeposit = () => {
	return useMutation({
		mutationKey: ['DEPOSIT-U01'],
		mutationFn: async (data: DepositCreateType) => {
			return await api.put(API.DEPOSIT, data);
		},
	});
};
