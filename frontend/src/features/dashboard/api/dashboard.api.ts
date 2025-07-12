import { DashboardResponse } from './dashboard.dto';
import { mock as mockData } from './mock/dashboard.list';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL

export const useSelectDashboard = () => {
	console.log(API_URL);
	return useQuery<unknown, Error, DashboardResponse>({
		queryKey: ['DASHARD-R01'],
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
