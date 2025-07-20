import { DashboardResponse } from './dashboard.dto';
import { useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import axios from 'axios';
// import { mock as mockData } from './mock/dashboard.list';
// import { mock as mockSise } from './mock/dashboard.sise';

export const useSelectDashboard = () => {
	return useSuspenseQuery<unknown, Error, DashboardResponse>({
		queryKey: ['DASHBOARD-R01'],
		queryFn: async (): Promise<DashboardResponse> => {
			const main = await axios.get(API.DASHBOARD);
			const sise = await axios.get(API.DASHBOARD_SISE);
			return { ...(main.data || {}), sise: [...(sise?.data?.value || [])] };
		},
		// queryFn: async () => {
		// 	return Query.parse(await axios.get(API.DASHBOARD));
		// },
		// select: (res) => res?.data?.map((a) => a.userid),
	});
};

// export const useSelectDashboard = () => {
//   return useQuery<DashboardResponse>({
//     queryKey: ['DASHBOARD-R01'],
//     queryFn: async (): Promise<DashboardResponse> => {
//       const res = await axios.get(API.DASHBOARD);
//       return res?.data;
//     },
//     suspense: true,
//   });
// };

// export const useSelectDashboardSise = () => {
// 	return useQuery<unknown, Error, DashboardSiseResponse>({
// 		queryKey: ['DASHBOARD-R02'],
// 		queryFn: async () => {
// 			return Query.parse(await axios.get(API.DASHBOARD_SISE));
// 		},
// 	});
// };
