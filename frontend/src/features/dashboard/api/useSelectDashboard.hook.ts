import data from './mock/dashboard.list.mook.json';
import { useQuery } from '@tanstack/react-query';

export enum UseYn {
	Yes = 'Y',
	No = 'N',
}

export interface DashboardResponse {
	stockid: number;
	userid: string;
	code: string;
	name: string;
	rprice: number;
	rtime: string;
	kcount: number;
	kprice: number;
	ecount: number;
	eprice: number;
	sprice: number;
	showyn: UseYn;
	utime: string;
	ctime: string;
}

export const useSelectDashboard = () => {
	return useQuery<unknown, Error, string[]>({
		queryKey: ['dashboard-s01'],
		queryFn: () => ({
			data: data,
		}),
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
