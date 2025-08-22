import { DividendItemType as DataType } from '../api/dividend.dto';
import clsx from 'clsx';
import { EID } from '@shared/config/default.config';
import Flex from '@entites/Flex';
import { NoData } from '@entites/NoData';
import { Card, CardListWrap } from '@entites/Card';
import { styled } from '@styles/stitches.config';
import { SubTitle } from '@entites/Title';
import { Text } from '@entites/Text';
import { toCost } from '@shared/libs/utils.lib';
import { RowField } from '@entites/LineRowField';
import { IconDelete } from '@entites/Icons';
import { IconButton } from '@entites/IconButton';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@shared/config/common.constant';

export const StyledCard = styled(Card, {
	'&.card': {
		height: '300px',

		'.box': {
			'.body': {
				padding: '10px 4px',
				borderBottom: 'unset',

				'.left': {
					'.title': {
						width: '100px',
					},
				},
			},
		},
	},
});

export const DividendList = ({
	viewType = 'year',
	head,
	list,
	onClick,
	onClickItem,
}: {
	viewType?: 'year' | 'code';
	head?: DataType[];
	list?: Record<string, DataType[]>;
	onClick?: (eid?: string, item?: DataType) => void;
	onClickItem?: (eid?: string, item?: DataType) => void;
}) => {
	if (!head?.length) return <NoData />;

	return (
		<CardListWrap>
			{head?.map((item) => {
				const { title } = item;
				const data = list?.[title as string];
				return (
					<DividendCard
						key={item.rowid}
						viewType={viewType}
						head={item}
						data={data}
						onClick={(eid, value) => onClick?.(eid, value)}
						onClickItem={onClickItem}
					/>
				);
			})}
		</CardListWrap>
	);
};

export const DividendCard = ({
	viewType = 'year',
	head,
	data,
	onClick,
	onClickItem,
}: {
	viewType?: 'year' | 'code',
	head?: DataType;
	data?: DataType[];
	onClick?: (eid?: string, year?: DataType) => void;
	onClickItem?: (eid?: string, item?: DataType) => void;
}) => {
	return (
		<StyledCard className={clsx('card', { sm: !history })}>
			<Flex className='box border' direction='column'>
				<Flex className='head' justify={'between'} onClick={() => onClick?.(EID.SELECT, head)}>
					<SubTitle title={head?.title} />
					<Text bold text={`${toCost(head?.price)}`} />
				</Flex>

				<Flex className='body' direction={'column'}>
					{data?.map((item) => {
						return (
							<RowField
								key={item.rowid}
								height={28}
								title={(viewType === 'year' ? `[${dayjs(item?.sdate).format('MM/DD')}] ${item?.name}` : dayjs(item?.sdate).format(DATE_FORMAT)) as string}
								text={`${item?.cost} x ${item?.count}`}
								value={toCost(item?.price)}
								onClick={() => onClickItem?.(EID.EDIT, item)}
								buttons={
									<Flex style={{ paddingLeft: 4 }}>
										<IconButton icon={<IconDelete />} onClick={() => onClickItem?.(EID.DELETE, item)} />
									</Flex>
								}
							/>
						);
					})}
				</Flex>
			</Flex>
		</StyledCard>
	);
};
