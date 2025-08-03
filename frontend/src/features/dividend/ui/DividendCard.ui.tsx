import { DividendItemType as DataType } from '../api/dividend.dto';
import clsx from 'clsx';
import { EID } from '@shared/config/default.config';
import { IconButton, IconType } from '@entites/IconButton';
import Flex from '@entites/Flex';
import { NoData } from '@entites/NoData';
import { Card } from '@entites/Card';
import { styled } from '@styles/stitches.config';
import { CardLineFiled } from '@features/common/ui/CardLineField.ui';
import dayjs from 'dayjs';
import { ST } from '@shared/config/kor.lang';
import { SubTitle } from '@entites/Title';

export const StyledCard = styled(Card, {});

export const DividendList = ({
	list,
	onClick,
}: {
	list?: DataType[];
	onClick?: (eid?: string, item?: DataType) => void;
}) => {
	if (!list?.length) return <NoData />;

	return (
		<Flex className={'card-list'}>
			{list?.map((item) => (
				<DividendCard key={item.rowid} data={item} onClick={(eid, item) => onClick?.(eid, item)} />
			))}
		</Flex>
	);
};

export const DividendCard = ({
	data,
	onClick,
}: {
	data: DataType;
	onClick?: (eid?: string, item?: DataType) => void;
}) => {
	const handleClick = (eid?: string) => {
		onClick?.(eid, data);
	};

	return (
		<StyledCard className={clsx('card', { sm: !history })}>
			<Flex className='box' direction='column' onClick={() => handleClick(EID.SELECT)}>
				<Flex className='head'>
					<SubTitle title={data?.name} />
				</Flex>
				<Flex className='body'>
					<CardLineFiled
						title={dayjs(data.sdate).format('YYYY-MM-DD')}
						text={`${data?.cost} x ${data?.count}`}
						value={data?.price}
						suffix={{ value: ST.WON }}
					/>
				</Flex>
				<Flex className='foot' justify={'end'}>
					<Flex gap={8} fullWidth={false}>
						<IconButton type={IconType.EDIT} eid='edit' onClick={handleClick} />
						<IconButton type={IconType.DELETE} eid='delete' onClick={handleClick} />
					</Flex>
				</Flex>
			</Flex>
		</StyledCard>
	);
};
