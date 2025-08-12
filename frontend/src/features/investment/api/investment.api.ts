import { InvestmentItemType, InvestmentRefreshType, InvestmentResponse, InvestmentSearchParam } from './investment.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';
import { MarketItemType } from '@features/market/api/market.dto';

// 목록 조회
export const useSelectInvestment = () => {
	return useSuspenseQuery<unknown, Error, InvestmentResponse>({
		queryKey: ['INVESTMENT-R01'],
		queryFn: async (): Promise<InvestmentResponse> => {
			const main = await api.get(API.INVEST);
			return main.data;
		},
	});
};

// 추가
export const useCreateInvestment = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-C01'],
		mutationFn: async (data: MarketItemType) => {
			return await api.post(API.INVEST, data);
		},
	});
};

// 삭제
export const useDeleteInvestment = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-D01'],
		mutationFn: async (rowid: string | number) => {
			return await api.delete(API.INVEST, { params: { rowid } });
		},
	});
};

// 수정
export const useUpdateInvestment = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-U01'],
		mutationFn: async (data: InvestmentItemType) => {
			return await api.put(API.INVEST, data);
		},
	});
};

// 평가 데이터 갱신
export const useRefreshInvestment = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-U02'],
		mutationFn: async (data: InvestmentRefreshType) => {
			return await api.put(API.INVEST_REFRESH, data);
		},
	});
};

// 평가 데이터 네이버로 갱신
export const useUpdateInvestmentByNaver = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-U03'],
		mutationFn: async (data: InvestmentRefreshType) => {
			return await api.put(API.INVEST_UPDATE_BY_NAVER, data);
		},
	});
};

// 데이터 초기화
export const useClearInvestment = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-U04'],
		mutationFn: async (rowid: string | number) => {
			return await api.put(API.INVEST_CLEAR, { rowid });
		},
	});
};

// 상세 데이터 가져오기
export const useSelectInvestmentDetail = (code: string) => {
	return useSuspenseQuery<unknown, Error, InvestmentResponse>({
		queryKey: ['INVESTMENT-R02', code],
		queryFn: async (): Promise<InvestmentResponse> => {
			const main = await api.get(API.INVEST, { params: { code } });
			return main.data;
		},
	});
};

// 상세 데이터 가져오기
export const useSelectInvestmentReport = () => {
	return useMutation({
		mutationKey: ['INVESTMENT-R04'],
		mutationFn: async (params: InvestmentSearchParam) => {
			return await api.get(API.INVEST_REPORT, { params });
		},
	});
};

// export const useSelectInvestmentReport = (code?: string) => {
// 	return useSuspenseQuery<unknown, Error, InvestmentResponse>({
// 		queryKey: ['INVESTMENT-R03', code],
// 		queryFn: async (): Promise<InvestmentResponse> => {
// 			const main = await api.get(API.INVEST_REPORT, { params: { code } });
// 			return main.data;
// 		},
// 	});
// }

