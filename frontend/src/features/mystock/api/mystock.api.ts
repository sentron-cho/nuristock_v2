import { useToast } from '@layouts/hooks/toast.hook';
import { MyStockResponse } from './mystock.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import axios from 'axios';
import { MarketItemType } from '@features/market/api/market.dto';
import { ST } from '@shared/config/kor.lang';
import { FieldValues } from 'react-hook-form';

export const useSelectMyStock = (code: string) => {
	return useSuspenseQuery({
		queryKey: ['MYSTOCK-R01', code],
		queryFn: async (): Promise<MyStockResponse> => {
			const main = await axios.get(API.MYSTOCK, { params: { code } });
			const sise = await axios.get(API.MYSTOCK_SISE, { params: { code } });
			return { ...(main.data || {}), sise: { ...sise?.data?.value } };
		},
	});
};

export const useCreateMyStock = () => {
	const { toast } = useToast();

	return useMutation({
		mutationKey: ['MYSTOCK-C01'],
		mutationFn: async (data: MarketItemType) => {
			return await axios.post(API.MYSTOCK, data);
		},
		onError: (error) => {
			console.log(error);
			const err = error as FieldValues
			toast('error', err?.response?.data?.message || ST.ERROR_PROBLEM);
		},
	});
};

// export const useSelectMyStockSise = (code?: string) => {
// 	return useQuery<unknown, Error, MyStockSiseResponse, ['MYSTOCK-R02', string | undefined]>({
// 		queryKey: ['MYSTOCK-R02', code],
// 		queryFn: async () => {
// 			return Query.parse(await axios.get(API.MYSTOCK_SISE, { params: { code } }));
// 		}
// 		enabled: !!code, // ✅ code가 있을 때만 실행되도록 (선택)
// 		// select: (res) => res?.data?.map((a) => a.userid),
// 	});
// };

// export const useSelectMyStockSise = (code?: string) => {
// 	return useQuery({
// 		queryKey: ['MYSTOCK-R02', code],
// 		queryFn: async (): Promise<MyStockSiseResponse> => {
// 			const res = await axios.get(API.MYSTOCK_SISE, { params: { code } });
// 			return res.data;
// 		},
// 		enabled: !!code,
// 	});
// };
