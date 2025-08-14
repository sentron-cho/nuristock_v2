import { AssetCreateType, AssetResponse } from './asset.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';

// 조회
export const useSelectAsset = (code?: string) => {
	return useSuspenseQuery({
		queryKey: ['ASSET-R01', code],
		queryFn: async (): Promise<AssetResponse> => {
			const main = await api.get(API.ASSET, { params: { code } });
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