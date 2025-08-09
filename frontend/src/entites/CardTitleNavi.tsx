import { useMemo } from 'react';
import { SubTitle, Title } from './Title';
import Flex from './Flex';
import clsx from 'clsx';
import { OptionType } from '@shared/config/common.type';

export const CardTitleNavi = ({
	options,
	value,
  onClick,
  onClickTitle,
}: {
	options?: OptionType[];
	value?: string;
	onClick?: (eid?: string) => void;
	onClickTitle?: () => void;
}) => {
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

	return (
		<Flex className={clsx('card-title-navi')} gap={10} justify={'center'}>
			<SubTitle
				fontSize={'small'}
				className={clsx('button', 'left')}
				title={`${prev?.label}`}
				onClick={() => onClick?.(prev?.value)}
			/>
			<Title
				flex={1}
				align='center'
				className={clsx('navi')}
				title={`${current?.label}`}
				onClick={() => onClickTitle?.()}
			/>
			<SubTitle
				fontSize={'small'}
				className={clsx('button', 'right')}
				title={`${next?.label}`}
				onClick={() => onClick?.(next?.value)}
			/>
		</Flex>
	);
};
