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
		dividend: { title: ST.DIVIDEND, color: 'success', variant: 'outlined' },
		buy: { title: ST.BUY, color: 'primary', variant: 'outlined' }, // 매수
		sell: { title: ST.SELL, color: 'error', variant: 'outlined' }, // 매도
		manual: { title: ST.HEND_WRITING, color: 'default', variant: 'filled' },
		deposit: { title: ST.BANK_INPUT, color: 'error', variant: 'filled' }, // 입금
		withdraw: { title: ST.BANK_OUTPUT, color: 'primary', variant: 'filled' }, // 출금
	} as FieldValues;

	return [
		{
			title: ST.TYPE,
			key: 'stype',
			align: 'center',
			width: 50,
			formatter: (v) => {
				const data = type?.[v];
				return (
					<Flex justify={'center'}>
						<Chip size='xsmall' label={data?.title} color={data?.color} variant={data?.variant} />
					</Flex>
				);
			},
		},
		{ title: ST.DATE, size: 'xs', key: 'sdate', formatter: (v) => dayjs(v).format('YYYY-MM-DD HH:mm'), flex: 1 },
		{ title: ST.TAX, size: 'xs', key: 'tax', formatter: (v) => Number(v) ? toCost(v) : '', align: 'right', width: 60 },
		{ title: ST.PRICE, size: 'xs', key: 'price', bold: true, formatter: (v) => toCost(v), align: 'right', width: 120 },
		{
			key: 'button',
			width: 30,
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
