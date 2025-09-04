import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';
import { ResearchInfoResponse, ResearchItemType, ResearchRefreshType, ResearchResponse } from './research.dto';
import dayjs from 'dayjs';
import { MarketItemType } from '@features/market/api/market.dto';

export const useSelectResearch = (year: string = dayjs().add(-1, 'year').format('YYYY')) => {
	return useQuery({
		queryKey: ['RESEARCH-R01', year],
		queryFn: async (): Promise<ResearchResponse> => {
			const res = await api.get(API.RESEARCH, { params: { year } });
			return res?.data;
		},
	});
};

// 추가
export const useCreateInvestment = () => {
	return useMutation({
		mutationKey: ['RESEARCH-C01'],
		mutationFn: async (data: MarketItemType) => {
			return await api.post(API.RESEARCH, data);
		},
	});
};

// 삭제
export const useDeleteResearch = () => {
	return useMutation({
		mutationKey: ['RESEARCH-D01'],
		mutationFn: async ({ rowid, code }: { rowid?: string | number; code?: string }) => {
			return await api.delete(API.RESEARCH, { params: { rowid, code } });
		},
	});
};

// 수정
export const useUpdateResearch = () => {
	return useMutation({
		mutationKey: ['RESEARCH-U01'],
		mutationFn: async (data: ResearchItemType) => {
			return await api.put(API.RESEARCH, data);
		},
	});
};

// 신규 년도 추가
export const useCreateResearchYear = () => {
	return useMutation({
		mutationKey: ['RESEARCH-C02'],
		mutationFn: async (data: ResearchItemType) => {
			return await api.post(API.RESEARCH_YEAR, data);
		},
	});
};

// 상세 데이터 가져오기
export const useSelectResearchDetail = (code: string) => {
	return useSuspenseQuery<unknown, Error, ResearchResponse>({
		queryKey: ['RESEARCH-R02', code],
		queryFn: async (): Promise<ResearchResponse> => {
			const main = await api.get(API.RESEARCH_DETAIL, { params: { code } });
			return main.data;
		},
	});
};

// 평가 데이터 갱신
export const useRefreshResearch = () => {
	return useMutation({
		mutationKey: ['RESEARCH-U02'],
		mutationFn: async (data: ResearchRefreshType) => {
			return await api.put(API.RESEARCH_REFRESH, data);
		},
	});
};

// 시세 데이터 가져오기
export const useSelectResearchByNaver = () => {
	return useMutation({
		mutationKey: ['RESEARCH-R03'],
		mutationFn: async (code?: string): Promise<ResearchInfoResponse> => {
			const res = await api.get(API.RESEARCH_NAVER, { params: { code } });
			return res?.data;
		},
	});
};

// 평가 데이터 네이버로 갱신
export const useUpdateResearchByNaver = () => {
	return useMutation({
		mutationKey: ['RESEARCH-U03'],
		mutationFn: async (data: ResearchRefreshType) => {
			return await api.put(API.RESEARCH_UPDATE_BY_NAVER, data);
		},
	});
};
