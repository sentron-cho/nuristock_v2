import { DashboardResponse, MyStockUpdateType } from './dashboard.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';
import { MarketItemType } from '@features/market/api/market.dto';

export const useSelectDashboard = () => {
	return useSuspenseQuery<unknown, Error, DashboardResponse>({
		queryKey: ['DASHBOARD-R01'],
		queryFn: async (): Promise<DashboardResponse> => {
			const main = await api.get(API.DASHBOARD);
			return main.data;
		},
		// queryFn: async () => {
		// 	return Query.parse(await axios.get(API.DASHBOARD));
		// },
		// select: (res) => res?.data?.map((a) => a.userid),
	});
};


export const useCreateDashboard = () => {
	return useMutation({
		mutationKey: ['DASHBOARD-C01'],
		mutationFn: async (data: MarketItemType) => {
			return await api.post(API.DASHBOARD, data);
		},
	});
};

export const useDeleteDashboard = () => {
	return useMutation({
		mutationKey: ['DASHBOARD-D01'],
		mutationFn: async (code: string) => {
			return await api.delete(API.DASHBOARD, { params: { code } });
		},
	});
};

export const useUpdateDashboard = () => {
	return useMutation({
		mutationKey: ['DASHBOARD-U01'],
		mutationFn: async (data: MyStockUpdateType) => {
			return await api.put(API.DASHBOARD, data);
		},
	});
};