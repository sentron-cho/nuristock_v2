import { BucklistCreateType, BucklistResponse } from './bucketlist.dto';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import api from '@shared/api/axios.config';
import { API } from '@shared/config/url.enum';
// import api from '@shared/api/axios.config';

export const useSelectBucket = (page?: string) => {
  return useSuspenseQuery({
    queryKey: ['PROFIT-R01', page],
    queryFn: async (): Promise<BucklistResponse> => {
      const main = await api.get(API.BUCKET, { params: { page } });
      return main.data;
    },
  });
};

// 추가
export const useCreateBucket = () => {
	return useMutation({
		mutationKey: ['BUCKET-C01'],
		mutationFn: async (data: BucklistCreateType) => {
			return await api.post(API.BUCKET, data);
		},
	});
};

// 삭제
export const useDeleteBucket = () => {
	return useMutation({
		mutationKey: ['BUCKET-D01'],
		mutationFn: async (params: { rowid?: number }) => {
			return await api.delete(API.BUCKET, { params });
		},
	});
};

// 수정
export const useUpdateBucket = () => {
	return useMutation({
		mutationKey: ['BUCKET-U01'],
		mutationFn: async (data: BucklistCreateType) => {
			return await api.put(API.BUCKET, data);
		},
	});
};