import Flex from '@entites/Flex';
import { GridHeaderType } from '@entites/GridList';
import { IconDelete } from '@entites/Icons';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { toCost } from '@shared/libs/utils.lib';
import { DepositItemType } from '../api/deposit.dto';
import dayjs from 'dayjs';
import { Chip } from '@entites/Chip';
import { FieldValues } from 'react-hook-form';

export const GridHeader = ({ onClick }: { onClick?: (eid: string, item?: DepositItemType) => void }) => {

	const type = {
		manual: { title: ST.HEND_WRITING, color: 'primary' },
		dividend: { title: ST.DIVIDEND, color: 'success' },
		sell: { title: ST.SELL, color: 'warning' },
		buy: { title: ST.BUY, color: 'error' },
	} as FieldValues;

	return [
		{
			title: ST.TYPE,
			key: 'stype',
			align: 'center',
			width: 60,
			formatter: (v) => {
				const data = type?.[v];
				return (
					<Flex justify={'center'}>
						<Chip size='xsmall' label={data?.title} color={data?.color} />
					</Flex>
				);
			},
		},
		{ title: ST.DATE, key: 'sdate', formatter: (v) => dayjs(v).format('YYYY-MM-DD HH:mm'), flex: 1 },
		{ title: ST.PRICE, key: 'price', bold: true, formatter: (v) => toCost(v), align: 'right', flex: 1 },
		{
			key: 'button',
			width: 40,
			formatter: (_v, row) => (
				<Flex gap={4} justify={'center'}>
					<IconDelete
						onClick={(e) => {
							if (onClick) {
								e.stopPropagation();
								onClick(EID.DELETE, row as DepositItemType);
							}
						}}
					/>
				</Flex>
			),
		},
	] as GridHeaderType[];
};
