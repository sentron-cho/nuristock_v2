import { MarketResponse } from './market.dto';
import { useQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';

export const useSelectMarket = (name?: string) => {
	return useQuery({
		queryKey: ['MYMARKET-R01', name],
		queryFn: async (): Promise<MarketResponse> => {
			const res = await api.get(API.MARKET, { params: { name } });
			return res?.data;
		},
	});
};