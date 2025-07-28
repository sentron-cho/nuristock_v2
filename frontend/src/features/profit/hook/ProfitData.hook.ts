import { cloneDeep, reverse, sortBy } from 'lodash';
import { useMemo } from 'react';
import { ProfitItemType as DataType, ProfitYearsItemType as YearDataType } from '../api/profit.dto';

export const useProfitData = (initialData?: DataType[], initialYears?: YearDataType[]) => {
	// 년도별 데이터 초기화
	// const years = useMemo(() => {
	// 	const items = initialYears?.map((a) => ({ value: a?.year, label: a?.year }) as SelectOptionType);
	// 	return reverse(sortBy(items, 'value'));
	// }, [initialYears]);
	const years = useMemo(() => {
		return reverse(sortBy(initialYears, 'year'));
	}, [initialYears]);

	// 메인 데이터 초기화
	const data = useMemo(() => {
		const items = cloneDeep(initialData)?.map((a) => {
			const sprice = (a?.scost || 0) * (a?.count || 0);
      const eprice = (a?.ecost || 0) * (a?.count || 0);
      const sonic = (eprice || 0) - (sprice || 0);

      console.log({a, sonic})
			return {
				...a,
				eprice,
				sprice,
				sonic,
			};
		});

		return items;
	}, [initialData]);

	const summary = useMemo(() => {
		const vCodes = (data as DataType[])?.map((a) => Number(a.eprice) - Number(a.sprice))?.reduce((a, b) => a + b, 0);
		const values: string[] = [
			vCodes?.toString() || '',
			vCodes?.toString() || '',
			vCodes?.toString() || '',
			vCodes?.toString() || '',
		];
		return values;
	}, [data]);

	return {
		years,
		data,
		summary,
	};
};
