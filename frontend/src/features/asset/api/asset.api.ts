import { AssetCreateType, AssetResponse, EvaluationCreateType, EvaluationResponse } from './asset.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';
import dayjs from 'dayjs';

// 조회
export const useSelectAsset = (year: string = dayjs().format('YYYY')) => {
	return useSuspenseQuery({
		queryKey: ['ASSET-R01', year],
		queryFn: async (): Promise<AssetResponse> => {
			const main = await api.get(API.ASSET, { params: { year } });
			return main.data;
		},
	});
};

// 추가
export const useCreateAsset = () => {
	return useMutation({
		mutationKey: ['ASSET-C01'],
		mutationFn: async (data: AssetCreateType) => {
			return await api.post(API.ASSET, data);
		},
	});
};

// 삭제
export const useDeleteAsset = () => {
	return useMutation({
		mutationKey: ['ASSET-D01'],
		mutationFn: async (params: { rowid: number; code: string }) => {
			return await api.delete(API.ASSET, { params });
		},
	});
};

// 수정
export const useUpdateAsset = () => {
	return useMutation({
		mutationKey: ['ASSET-U01'],
		mutationFn: async (data: AssetCreateType) => {
			return await api.put(API.ASSET, data);
		},
	});
};

export const useSelectEvaluation = (code?: string) => {
	return useSuspenseQuery({
		queryKey: ['ASSET-R01', code],
		queryFn: async (): Promise<EvaluationResponse> => {
			const main = await api.get(API.EVALUATION, { params: { code } });
			return main.data;
		},
	});
};

// 추가
export const useCreateEvaluation = () => {
	return useMutation({
		mutationKey: ['EVALUATION-C01'],
		mutationFn: async (data: EvaluationCreateType) => {
			return await api.post(API.EVALUATION, data);
		},
	});
};

// 삭제
export const useDeleteEvaluation = () => {
	return useMutation({
		mutationKey: ['EVALUATION-D01'],
		mutationFn: async (params: { rowid: number; code: string }) => {
			return await api.delete(API.EVALUATION, { params });
		},
	});
};

// 수정
export const useUpdateEvaluation = () => {
	return useMutation({
		mutationKey: ['EVALUATION-U01'],
		mutationFn: async (data: EvaluationCreateType) => {
			return await api.put(API.EVALUATION, data);
		},
	});
};
