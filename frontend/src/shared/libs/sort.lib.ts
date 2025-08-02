import dayjs from 'dayjs';
import { reverse, sortBy } from 'lodash';
import { FieldValues } from 'react-hook-form';

export const groupedByYear = <T extends FieldValues = FieldValues>(data?: T[], columnKey = 'edate') => {
	return data?.reduce(
		(acc, item) => {
			const year = dayjs(item[columnKey]).format('YYYY'); // '20241104' → '2024'
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(item);
			return acc;
		},
		{} as Record<string, typeof data>
	);
};

export const groupedByName = <T extends FieldValues = FieldValues>(data?: T[], columnKey = 'name') => {
	return data?.reduce(
		(acc, item) => {
			const name = item[columnKey];
			if (!acc[name]) acc[name] = [];
			acc[name].push(item);
			return acc;
		},
		{} as Record<string, typeof data>
	);
};

// [ {key: value} ] 배열 형식의 오브젝트를 배열 형식으로 변환
export const sortedByKey = <T extends FieldValues = FieldValues>(data?: T, columnKey = 'sonic', isDesc = false) => {
	if (data) {
		const items = sortBy(Object.values(data), columnKey);
		return isDesc ? reverse(items) : items;
	} else {
		return [];
	}

	// let array: FieldValues = {};
	// sortedList.forEach((item) => {
	// 	item[columnKey] && (array[item[columnKey]] = item);
	// });
	// return array;
};
