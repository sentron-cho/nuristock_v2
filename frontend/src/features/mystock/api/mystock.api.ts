import { MyStockResponse } from './mystock.dto';
import { useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import axios from 'axios';
// import { mock as mockData } from './mock/mystock.list';
// import { mock as mockSise } from './mock/mystock.sise';

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
