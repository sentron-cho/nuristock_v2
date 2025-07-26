import { ProfitResponse, ProfitYearsResponse } from './profit.dto';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import api from '@shared/api/axios.config';
import { API } from '@shared/config/url.enum';
// import api from '@shared/api/axios.config';

export const useSelectProfit = (year?: string) => {
	return useSuspenseQuery({
		queryKey: ['PROFIT-R01', year],
		queryFn: async (): Promise<ProfitResponse> => {
			const main = await api.get(API.PROFIT, { params: { year } });
			return main.data;
		},
	});
};

export const useSelectProfitYears = () => {
	return useQuery({
		queryKey: ['PROFIT-R02'],
		queryFn: async (): Promise<ProfitYearsResponse> => {
			const main = await api.get(API.PROFIT_YEARS);
			return main.data;
		},
	});
};
