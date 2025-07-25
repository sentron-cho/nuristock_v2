import { MyStockKeepCreateType, MyStockResponse, MyStockSellCreateType } from './mystock.dto';
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
		mutationKey: ['MYSTOCK-C02'],
		mutationFn: async (data: MyStockSellCreateType) => {
			return await api.post(API.MYSTOCK_SELL, data);
		},
	});
};

// 매수 주식 삭제
export const useDeleteMyStockBuy = () => {
	return useMutation({
		mutationKey: ['MYSTOCK-D01'],
		mutationFn: async (params: { rowid: number; code: string }) => {
			return await api.delete(API.MYSTOCK_BUY, { params });
		},
	});
};

// 매도 주식 삭제
export const useDeleteMyStockSell = () => {
	return useMutation({
		mutationKey: ['MYSTOCK-D02'],
		mutationFn: async (params: { rowid: number; code: string }) => {
			return await api.delete(API.MYSTOCK_SELL, { params });
		},
	});
};

// 주식 매수(매수 수정)
export const useUpdateMyStockBuy = () => {
	return useMutation({
		mutationKey: ['MYSTOCK-U01'],
		mutationFn: async (data: MyStockKeepCreateType) => {
			return await api.put(API.MYSTOCK_BUY, data);
		},
	});
};


// 주식 매도(매도 수정)
export const useUpdateMyStockSell = () => {
	return useMutation({
		mutationKey: ['MYSTOCK-U02'],
		mutationFn: async (data: MyStockSellCreateType) => {
			return await api.put(API.MYSTOCK_BUY, data);
		},
	});
};


// export const useUpdateMyStock = () => {
// 	return useMutation({
// 		mutationKey: ['MYSTOCK-U01'],
// 		mutationFn: async (data: MyStockKeepCreateType) => {
// 			return await api.put(API.MYSTOCK, data);
// 		},
// 	});
// };
