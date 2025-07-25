import { MyStockKeepCreateType, MyStockResponse } from './mystock.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import { MarketItemType } from '@features/market/api/market.dto';
import api from '@shared/api/axios.config';

export const useSelectMyStock = (code: string) => {
	return useSuspenseQuery({
		queryKey: ['MYSTOCK-R01', code],
		queryFn: async (): Promise<MyStockResponse> => {
			const main = await api.get(API.MYSTOCK, { params: { code } });
			// const sise = await api.get(API.MYSTOCK_SISE, { params: { code } });
			return main.data;
		},
	});
};

// 주식 매수(매수 추가)
export const useCreateMyStockBuy = () => {
	return useMutation({
		mutationKey: ['MYSTOCK-C01'],
		mutationFn: async (data: MyStockKeepCreateType) => {
			return await api.post(API.MYSTOCK_BUY, data);
		},
	});
};

// 주식 매도(매도 추가)
export const useCreateMyStockSell = () => {
	return useMutation({
		mutationKey: ['MYSTOCK-C01'],
		mutationFn: async (data: MyStockKeepCreateType) => {
			return await api.post(API.MYSTOCK_SELL, data);
		},
	});
};


export const useDeleteMyStock = () => {
	return useMutation({
		mutationKey: ['MYSTOCK-D01'],
		mutationFn: async (code: string) => {
			return await api.delete(API.MYSTOCK, { params: { code } });
		},
	});
};

export const useUpdateMyStock = () => {
	return useMutation({
		mutationKey: ['MYSTOCK-U01'],
		mutationFn: async (data: MyStockKeepCreateType) => {
			return await api.put(API.MYSTOCK, data);
		},
	});
};