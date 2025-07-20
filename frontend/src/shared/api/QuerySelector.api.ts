import { AxiosResponse } from 'axios';
import { FieldValues } from 'react-hook-form';

export const Query = {
	parse: (res: AxiosResponse): Promise<{data: FieldValues}> => {
		console.log(res);
		return res.data;
		// if (!res.ok) {
		//   throw new Error('[API 응답 오류]' + res.status);
		// }

		// return res.json(); // ✅ 반드시 JSON 파싱 필요
	},
};
