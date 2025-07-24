import { ProfitResponse, ProfitYearsResponse } from './profit.dto';
import { mock as mockData } from './mock/profit.list';
import { mock as mockYears } from './mock/profit.years';
import { useQuery } from '@tanstack/react-query';
// import api from '@shared/api/axios.config';

export const useSelectProfit = () => {
	return useQuery<unknown, Error, ProfitResponse>({
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

export const useSelectProfitYears = () => {
		return useQuery<unknown, Error, ProfitYearsResponse>({
		queryKey: ['PROFIT-R02'],
		queryFn: () => mockYears,
	});
}