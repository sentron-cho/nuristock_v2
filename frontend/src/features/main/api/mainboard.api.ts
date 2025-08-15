import { MainboardResponse } from './mainboard.dto';
import { useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';

export const useSelectMainboard = () => {
	return useSuspenseQuery<unknown, Error, MainboardResponse>({
		queryKey: ['DASHBOARD-R01'],
		queryFn: async (): Promise<MainboardResponse> => {
			const main = await api.get(API.DASHBOARD);
			return main.data;
		},
	});
};