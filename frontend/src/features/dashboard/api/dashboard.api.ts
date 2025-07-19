import { DashboardResponse, DashboardSiseResponse } from './dashboard.dto';
import { mock as mockData } from './mock/dashboard.list';
import { mock as mockSise } from './mock/dashboard.sise';
import { useQuery } from '@tanstack/react-query';

// const API_URL = import.meta.env.VITE_API_URL

export const useSelectDashboard = () => {
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

export const useSelectDashboardSise = (code?: string) => {
	return useQuery<unknown, Error, DashboardSiseResponse>({
		queryKey: ['DASHARD-R02'],
		queryFn: () => mockSise,
	});
};

