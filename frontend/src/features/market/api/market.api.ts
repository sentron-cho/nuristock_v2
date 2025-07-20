import { MyStockResponse } from './market.dto';
import { useQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import axios from 'axios';
// import { mock as mockData } from './mock/mystock.list';
// import { mock as mockSise } from './mock/mystock.sise';

export const useSelectMarket = (name?: string) => {
	return useQuery({
		queryKey: ['MYMARKET-R01', name],
		queryFn: async (): Promise<MyStockResponse> => {
			const res = await axios.get(API.MARKET, { params: { name } });
			return res?.data;
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
