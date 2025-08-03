import { DiaryResponse } from './diary.dto';
import { useSuspenseQuery } from '@tanstack/react-query';
import api from '@shared/api/axios.config';
import { API } from '@shared/config/url.enum';
// import api from '@shared/api/axios.config';

export const useSelectDiary = (year?: string, month?: string) => {
	return useSuspenseQuery({
		queryKey: ['DIARY-R01', year],
		queryFn: async (): Promise<DiaryResponse> => {
			const main = await api.get(API.DIARY, { params: { year, month } });
			return main.data;
		},
	});
};