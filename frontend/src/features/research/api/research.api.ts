import { useQuery } from '@tanstack/react-query';
import { API } from '@shared/config/url.enum';
import api from '@shared/api/axios.config';
import { ResearchResponse } from './research.dto';
import dayjs from 'dayjs';

export const useSelectResearch = (year: string = dayjs().add(-1, 'year').format('YYYY')) => {
	return useQuery({
		queryKey: ['RESEARCH-R01', year],
		queryFn: async (): Promise<ResearchResponse> => {
			const res = await api.get(API.RESEARCH, { params: { year } });
			return res?.data;
		},
	});
};
