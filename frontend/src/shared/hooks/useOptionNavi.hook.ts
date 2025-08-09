import { OptionType } from '@shared/config/common.type';
import { useMemo } from 'react';

export const useNaviByOptions = ({ options, value }: { options?: OptionType[]; value?: string }) => {
	// 이전
	const prev = useMemo(() => {
		if (!options?.length || !value) return undefined;

		const index = options?.findIndex((a) => a?.value?.toString() === value?.toString()) - 1;
		if (index < 0) {
			return options[options?.length - 1];
		} else {
			return options[index];
		}
	}, [options, value]);

	// 다음
	const next = useMemo(() => {
		if (!options?.length || !value) return undefined;

		const index = options?.findIndex((a) => a?.value?.toString() === value?.toString()) + 1;
		if (index >= options?.length) {
			return options[0];
		} else {
			return options[index];
		}
	}, [options, value]);

	// 현재
  const current = useMemo(() => options?.find((a) => a?.value?.toString() === value?.toString()), [options, value]);
  
  return {
    prev,
    next,
    current,
  }
};
