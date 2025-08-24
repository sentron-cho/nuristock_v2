// src/pages/CalendarCell.tsx
import Flex from '@entites/Flex';
import { Text } from '@entites/Text';
import { ST } from '@shared/config/kor.lang';
import { isWeekend } from '@shared/libs/utils.lib';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const StyledCell = styled(Flex, {
	borderTop: '1px solid $gray500',
	height: '60px',
	padding: '$4',
	textAlign: 'center',
	cursor: 'pointer',

	'.buy': {
		color: '$greenhover'
	},

	'.minus': {
		color: '$minus',
	},

	'.plus': {
		color: '$plus',
	},

	variants: {
		isCurrentMonth: {
			true: { opacity: 1 },
			false: { opacity: 0.4 },
		},
		selected: {
			true: { backgroundColor: '$lightyellow' },
			false: {},
		},
	},
});

export type CalendarCellDataType = { count: number; sum: number; type: string };

export type CalendarTypeData = { buy?: CalendarCellDataType; sell?: CalendarCellDataType };

type CalendarCellProps = {
	date: string | Date;
	isCurrentMonth: boolean;
	selected?: boolean;
	data?: CalendarTypeData;
	today?: boolean;
	onClick: () => void;
};

export const CalendarCell = ({ date, data, onClick, isCurrentMonth, selected }: CalendarCellProps) => {
	const weekend = useMemo(() => {
		return isWeekend(date);
	}, [date]);

	return (
		<StyledCell
			className={clsx('cell', { weekend })}
			direction={'column'}
			isCurrentMonth={isCurrentMonth}
			selected={selected}
			onClick={onClick}
			gap={8}
		>
			<Text className='title' text={dayjs(date).date()} />

			<Flex className='text' direction={'column'} gap={2}>
				{data?.buy && <Text size='xs' className={clsx('buy')} text={`${ST.BUY}(${data?.buy?.count})`} />}
				{data?.sell && <Text size='xs' className={clsx(data?.sell?.type)} text={`${ST.SELL}(${data?.sell?.count})`} />}
			</Flex>
		</StyledCell>
	);
};
