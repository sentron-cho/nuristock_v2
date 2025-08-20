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
	years,
	list,
	onClick,
	onClickItem,
}: {
	years?: DataType[];
	list?: Record<string, DataType[]>;
	onClick?: (eid?: string, item?: DataType) => void;
	onClickItem?: (eid?: string, item?: DataType) => void;
}) => {
	if (!years?.length) return <NoData />;

	return (
		<CardListWrap>
			{years?.map((item) => {
				const { title } = item;
				const data = list?.[title as string];
				return (
					<DividendCard
						key={item.rowid}
						year={item}
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
	year,
	data,
	onClick,
	onClickItem,
}: {
	year?: DataType;
	data?: DataType[];
	onClick?: (eid?: string, year?: DataType) => void;
	onClickItem?: (eid?: string, item?: DataType) => void;
}) => {
	return (
		<StyledCard className={clsx('card', { sm: !history })}>
			<Flex className='box border' direction='column'>
				<Flex className='head' justify={'between'} onClick={() => onClick?.(EID.SELECT, year)}>
					<SubTitle title={year?.title} />
					<Text bold text={`${toCost(year?.price)}`} />
				</Flex>

				<Flex className='body' direction={'column'}>
					{data?.map((item) => {
						return (
							<RowField
								key={item.rowid}
								height={28}
								title={item?.name as string}
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
