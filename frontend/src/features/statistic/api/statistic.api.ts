import { useQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';
import { StatisticResponse } from './statistic.dto';

export const useSelectStatistic = () => {
	return useQuery({
		queryKey: ['STATISTIC-R01'],
		queryFn: async (): Promise<StatisticResponse> => {
			const res = await api.get(API.STATISTIC, { params: { } });
			return res?.data;
		},
	});
};
