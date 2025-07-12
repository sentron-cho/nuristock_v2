import { DashboardResponse } from './profit.dto';
import { mock as mockData } from './mock/profit.list';
// import { mock as mockDate } from './mock/profit.date';
import { useQuery } from '@tanstack/react-query';

export const useSelectDashboard = () => {
	return useQuery<unknown, Error, DashboardResponse[]>({
		queryKey: ['PROFIT-R01'],
		queryFn: () => mockData,
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
