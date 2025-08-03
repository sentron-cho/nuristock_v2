import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { DiaryItemType } from '../api/diary.dto';
import { useMemo } from 'react';
import { SubTitle, Title } from '@entites/Title';
import dayjs from 'dayjs';
import { ST } from '@shared/config/kor.lang';
import { Text } from '@entites/Text';
import clsx from 'clsx';
import { isWeekend, toCost, valueOfPlusMinus, valueOfweek } from '@shared/libs/utils.lib';

const StyledFlex = styled(Flex, {
	marginTop: 16,
	padding: 12,
	borderRadius: 8,

	'.contents-form': {
		'.line': {
			padding: '0 10px',
		},

		'.plus': {
			color: '$plus',
		},

		'.minus': {
			color: '$minus',
		},
	},
});

export const ContentsView = ({
	data,
	date,
}: {
	date?: string | dayjs.Dayjs;
	data?: { sell?: DiaryItemType[]; buy?: DiaryItemType[] };
}) => {
	console.log('[ContentsView]', { data, date: dayjs(date).format('YYYY-MM-DD') });

	const buyList = useMemo(() => {
		console.log(data);
		return data?.buy || [];
	}, [data]);

	const sellList = useMemo(() => {
		console.log(data);
		return data?.sell || [];
	}, [data]);

	return (
		<StyledFlex direction={'column'} align={'start'} gap={10}>
			<Flex direction={'row'} className={clsx({ weekend: isWeekend(dayjs(date).toDate()) })} gap={4}>
				<Title className={clsx('title')} title={dayjs(date).format('M월 DD일')} />
				<Text className={clsx('week')} text={`(${valueOfweek(dayjs(date).toDate())}요일)`} />
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
		<Flex className={clsx('contents-form', className)} direction='column' gap={8} align={'start'}>
			<SubTitle fontSize={'small'} title={type === 'trade' ? ST.BUY : ST.SELL} />
			<Flex className='line' direction={'column'} justify={'between'} align={'start'} gap={8}>
				{data?.map((item) => {
					const { name, sonic, sprice, scost, ecost, count } = item;
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
							<Flex className={clsx('trade', updown)}>
								<Text text={name} width={80} align='left' />
								<Text size='xs' text={`(${toCost(ecost)} - ${toCost(scost)}) x ${count}`} flex={1} align='left' />
								<Text text={toCost(sonic)} width={120} align='right' />
							</Flex>
						);
					}
				})}
			</Flex>
		</Flex>
	);
};
