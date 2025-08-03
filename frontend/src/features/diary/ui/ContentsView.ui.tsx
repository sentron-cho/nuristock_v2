import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { DiaryItemType } from '../api/diary.dto';
import { useMemo } from 'react';
import { SubTitle } from '@entites/Title';
import dayjs from 'dayjs';
import { ST } from '@shared/config/kor.lang';
import { Text } from '@entites/Text';
import clsx from 'clsx';
import { isWeekend, toCost, valueOfPlusMinus, valueOfweek } from '@shared/libs/utils.lib';
import { IconArrowLeft, IconArrowRight } from '@entites/Icons';

const StyledFlex = styled(Flex, {
	height: '100%',
	paddingBottom: '100px',

	'.contents-title-bar': {
		padding: '$4 $10',
		backgroundColor: '$lightyellow',
		position: 'sticky',
		top: 0,
		zIndex: 1,
	},

	'.contents-form': {
		// marginTop: '$10',

		'.line': {
			padding: '0 14px',
		},

		'.plus': {
			color: '$plus',
		},

		'.minus': {
			color: '$minus',
		},

		'.detail': {
			padding: '0 20px',
			opacity: '0.8',
		},
	},
});

export const ContentsView = ({
	data,
	date,
	onChangeDate,
}: {
	date?: dayjs.Dayjs;
	data?: { sell?: DiaryItemType[]; buy?: DiaryItemType[] };
	onChangeDate?: (value?: dayjs.Dayjs) => void;
}) => {
	// console.log('[ContentsView]', { data, date: dayjs(date).format('YYYY-MM-DD') });

	const buyList = useMemo(() => data?.buy || [], [data]);
	const sellList = useMemo(() => data?.sell || [], [data]);

	const onChange = (eid: 'prev' | 'next' | 'now') => {
		let selected: dayjs.Dayjs = dayjs(date);
		switch (eid) {
			case 'prev':
				selected = dayjs(selected).add(-1, 'day');
				break;
			case 'next':
				selected = dayjs(selected).add(1, 'day');
				break;
			case 'now':
				selected = dayjs();
				break;
		}

		onChangeDate?.(dayjs(selected));
	};

	return (
		<StyledFlex direction={'column'} align={'start'} gap={12}>
			<Flex className='contents-title-bar' justify={'center'} align={'center'}>
				<IconArrowLeft className='icon' onClick={() => onChange('prev')} />
				<Flex
					justify='center'
					direction={'row'}
					className={clsx({ weekend: isWeekend(dayjs(date).toDate()) })}
					gap={4}
					onClick={() => onChange('now')}
				>
					<SubTitle className={clsx('title')} title={dayjs(date).format('M월 DD일')} />
					<Text className={clsx('week')} text={`(${valueOfweek(dayjs(date).toDate())}요일)`} />
				</Flex>
				<IconArrowRight className='icon' onClick={() => onChange('next')} />
			</Flex>

			{buyList?.length > 0 && <ContentsForm type='keep' data={buyList} />}
			{sellList?.length > 0 && <ContentsForm type='trade' data={sellList} />}
		</StyledFlex>
	);
};

const ContentsForm = ({
	type = 'trade',
	className,
	data,
}: {
	type?: 'trade' | 'keep';
	className?: string;
	data?: DiaryItemType[];
}) => {
	return (
		<Flex className={clsx('contents-form', type, className)} direction='column' gap={4} align={'start'}>
			<SubTitle width={'100%'} textAlign={'center'} fontSize={'small'} title={type === 'trade' ? ST.SELL : ST.BUY} />
			<Flex className='line' direction={'column'} justify={'between'} align={'start'} gap={type === 'keep'? 8 : 12}>
				{data?.map((item) => {
					const { name, sonic, sprice, scost, ecost, count, sonicRate } = item;
					const updown = valueOfPlusMinus(sonic);

					if (type === 'keep') {
						// 매수
						return (
							<Flex className={clsx('keep')}>
								<Text text={name} width={80} align='left' />
								<Text size='xs' text={`${toCost(scost)} x ${count}`} flex={1} align='left' />
								<Text text={toCost(sprice)} width={120} align='right' />
							</Flex>
						);
					} else {
						// 매수/매도
						return (
							<Flex className={clsx('trade')} direction={'column'} gap={4} align={'start'}>
								{/* 요약 */}
								<Flex className={clsx(updown)} justify={'between'}>
									<Text text={`${name} (${sonicRate}%)`} flex={1} align='left' />
									<Text text={toCost(sonic)} flex={1} align='right' />
								</Flex>

								{/* 매수 */}
								<Flex className='detail' justify={'start'} width={280}>
									<Text size='xs' width={40} text={ST.BUY} />
									<Text size='xs' flex={1} text={`${toCost(scost)} x ${count}`} align='right' />
									<Text size='xs' flex={1} text={`${toCost(Number(scost) * count)}`} align='right' />
								</Flex>

								{/* 매도 */}
								<Flex className='detail' justify={'start'} width={280}>
									<Text size='xs' width={40} text={ST.SELL} />
									<Text size='xs' flex={1} text={`${toCost(ecost)} x ${count}`} align='right' />
									<Text size='xs' flex={1} text={`${toCost(Number(ecost) * count)}`} align='right' />
								</Flex>
							</Flex>
						);
					}
				})}
			</Flex>
		</Flex>
	);
};
