import { DashboardResponse } from './dashboard.dto';
import data from './mock/dashboard.list.mook.json';
import { useQuery } from '@tanstack/react-query';

export const useSelectDashboard = () => {
	return useQuery<unknown, Error, DashboardResponse[]>({
		queryKey: ['dashboard-s01'],
		queryFn: () => data,
	});

	// return useQuery<{ data: DashboardResponse[] }, Error, string[]>({
	// 	queryKey: ['dashboard-s01'],
	// 	// queryFn: () => fetch('/api/v0/dashboard'),
	// 	queryFn: () => ({
	// 		data: data,
	// 	}),
	// 	select: (res) => res?.data?.map((a) => a.userid),
	// });
};
