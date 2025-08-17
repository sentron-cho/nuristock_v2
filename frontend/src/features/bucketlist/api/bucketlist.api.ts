import { BucklistResponse } from './bucketlist.dto';
import { useSuspenseQuery } from '@tanstack/react-query';
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
