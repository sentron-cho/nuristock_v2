import { MarketResponse,  MarketSiseUpdateDataType } from './market.dto';
import { useMutation, useQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';

export const useSelectMarket = (name?: string) => {
	return useQuery({
		queryKey: ['MARKET-R01', name],
		queryFn: async (): Promise<MarketResponse> => {
			const res = await api.get(API.MARKET, { params: { name } });
			return res?.data;
		},
	});
};

export const useUpdateMarketSise = () => {
	return useMutation({
		mutationKey: ['MARKET-SISE-U01'],
		mutationFn: async (data: MarketSiseUpdateDataType) => {
			return await api.put(API.MARKET_SISE, data);
		},
	});
};