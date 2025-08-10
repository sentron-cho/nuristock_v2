import { InvestmentItemType, InvestmentRefreshType, InvestmentResponse } from './investment.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';
import { MarketItemType } from '@features/market/api/market.dto';

export const useSelectInvestment = () => {
	return useSuspenseQuery<unknown, Error, InvestmentResponse>({
		queryKey: ['INVESTMENT-R01'],
		queryFn: async (): Promise<InvestmentResponse> => {
			const main = await api.get(API.INVEST);
			return main.data;
		},
	});
};

export const useCreateInvestment = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-C01'],
		mutationFn: async (data: MarketItemType) => {
			return await api.post(API.INVEST, data);
		},
	});
};

export const useDeleteInvestment = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-D01'],
		mutationFn: async (code: string) => {
			return await api.delete(API.INVEST, { params: { code } });
		},
	});
};

export const useUpdateInvestment = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-U01'],
		mutationFn: async (data: InvestmentItemType) => {
			return await api.put(API.INVEST, data);
		},
	});
};

export const useRefreshInvestment = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-U02'],
		mutationFn: async (data: InvestmentRefreshType) => {
			return await api.put(API.INVEST_REFRESH, data);
		},
	});
};
