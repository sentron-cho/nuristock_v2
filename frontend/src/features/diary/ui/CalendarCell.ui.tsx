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
	// borderTop: '1px solid $gray500',
	// borderRadius: '$sm',
	height: '60px',
	padding: '$4',
	textAlign: 'center',
	cursor: 'pointer',

	// '.text': {
	// 	fontSize: 10,
	// 	lineHeight: 1.2,
	// },

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

export type CalendarTypeData = { buy?: number; sell?: number };

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
				{data?.buy && <Text size='xs' text={`${ST.BUY}(${data?.buy})`} />}
				{data?.sell && <Text size='xs' text={`${ST.SELL}(${data?.sell})`} />}
			</Flex>
		</StyledCell>
	);
};
