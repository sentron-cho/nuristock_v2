import dayjs from 'dayjs';
import { getCostColorType, toCost, withCommas } from './utils.lib';
import { Text } from '@entites/Text';
import clsx from 'clsx';

export const RenderDate = (
	value: string | Date,
	options?: {
		dateFormat?: string;
	}
) => {
	return dayjs(value).format(options?.dateFormat || 'YYYY-MM-DD');
};

export const RenderPrice = (
	value: number | string,
	options?: {
		className?: string;
		suffix?: string;
		color?: string;
	}
) => {
	const text = options?.suffix ? `${withCommas(value)} ${options?.suffix}` : toCost(value);

	return <Text fontSize={'small'} className={clsx(options?.color, options?.className)} text={text} />;
};

export const RenderCost = (
	value: number | string,
	options?: {
		className?: string;
		suffix?: string;
		color?: string;
	}
) => {
	const text = options?.suffix ? `${withCommas(value)} ${options?.suffix}` : withCommas(value);
	return <Text fontSize={'small'} className={clsx(options?.color, options?.className)} text={text} />;
};
