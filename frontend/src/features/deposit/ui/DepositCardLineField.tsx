// import { Text } from '@entites/Text';
// import { DepositItemType } from '../api/deposit.dto';
// import dayjs from 'dayjs';
// import { toCost } from '@shared/libs/utils.lib';
// import { useMemo } from 'react';
// import { ST } from '@shared/config/kor.lang';
// import { Deposit } from '@shared/config/common.enum';
// import { FieldValues } from 'react-hook-form';
// import { Chip } from '@entites/Chip';
// import { styled } from '@styles/stitches.config';
// import Flex from '@entites/Flex';
// import { EID } from '@shared/config/default.config';
// import { IconButton, IconType } from '@entites/IconButton';

// export const CHIP_TYPE = {
// 	[Deposit.MANUAL]: { value: ST.HEND_WRITING, color: 'primary' },
// 	[Deposit.SELL]: { value: ST.SELL, color: 'success' },
// 	[Deposit.BUY]: { value: ST.BUY, color: 'error' },
// 	[Deposit.DIVIDEND]: { value: ST.DIVIDEND, color: 'warning' },
// };

// const StyledRow = styled(Flex, {
// 	'&.row': {
// 		height: 32,
// 		lineHeight: 30,

// 		'.chip': {
// 			marginTop: '2px',
// 		},

// 		'.icon-button': {
// 			paddingTop: '2px',
// 		}
// 	},
// });

// export const DepositCardLineField = ({
// 	item,
// 	onClick,
// }: {
// 	item: DepositItemType;
// 	onClick?: (eid: string, item?: DepositItemType) => void;
// }) => {
// 	const chip = useMemo(() => {
// 		if (!item?.stype) return undefined;
// 		return (CHIP_TYPE as FieldValues)?.[item.stype];
// 	}, [item]);

// 	return (
// 		<StyledRow className='row' justify={'between'} align={'center'} onClick={() => onClick?.(EID.EDIT, item)}>
// 			<Flex flex={1} justify={'start'} gap={16} >
// 				{chip && <Chip label={chip.value} color={chip.color} />}
// 				<Text size='xs' text={dayjs(item.sdate).format('YYYY-MM-DD HH:mm')} />
// 			</Flex>

// 			<Flex flex={1} justify={'end'} gap={0}>
// 				<Text bold text={toCost(item?.price)} />
// 				<IconButton size={'xs'} type={IconType.DELETE} onClick={() => onClick?.(EID.DELETE, item)} />
// 			</Flex>
// 		</StyledRow>
// 	);
// };
