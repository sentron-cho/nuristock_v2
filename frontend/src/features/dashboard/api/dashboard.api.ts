import { DashboardResponse } from './dashboard.dto';
import { useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';

export const useSelectDashboard = () => {
	return useSuspenseQuery<unknown, Error, DashboardResponse>({
		queryKey: ['DASHBOARD-R01'],
		queryFn: async (): Promise<DashboardResponse> => {
			const main = await api.get(API.DASHBOARD);
			const sise = await api.get(API.DASHBOARD_SISE);
			return { ...(main.data || {}), sise: [...(sise?.data?.value || [])] };
		},
		// queryFn: async () => {
		// 	return Query.parse(await axios.get(API.DASHBOARD));
		// },
		// select: (res) => res?.data?.map((a) => a.userid),
	});
};