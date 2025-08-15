import { MainboardItemType as DataType, MainboardResponse } from '../api/mainboard.dto';
import { withCommas } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { EID } from '@shared/config/default.config';
import { CardLineFiled } from '@features/common/ui/CardLineField.ui';
import { styled } from '@styles/stitches.config';
import { useMainboardCardHook } from '../hook/Mainboard.hook';
import { ST } from '@shared/config/kor.lang';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@shared/config/common.constant';

const StyledFlex = styled(Flex, {
	'&.layout': {
		padding: '$10',

		'.left': {
			flex: 3,
		},

		'.right': {
			flex: 1,
		},

		'.minus': {
			color: '$minus',
		},
		'.plus': {
			color: '$plus',
		},
	},
});

export const MainboardCard = ({
	viewType = 'soincTop',
	data,
	onClick,
}: {
	viewType?: 'soincTop' | 'soincBottom' | 'latestSell' | 'latestBuy';
	data?: MainboardResponse;
	onClick?: (eid?: string, item?: DataType) => void;
}) => {
	const { sonicTop, sonicBottom, latestBuy, latestSell } = useMainboardCardHook(data);

	const handleClick = (eid?: string) => {
		// onClick?.(eid);
		console.log({ eid });
	};

	return (
		<StyledFlex className={clsx('layout')} gap={8} direction={'column'} onClick={() => handleClick(EID.SELECT)}>
			{viewType === 'soincTop' &&
				sonicTop?.map((item) => {
					return (
						<CardLineFiled
							className={clsx('soinc-top', item.type)}
							title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
							value={withCommas(item.siseSonic)}
							onClick={() => onClick?.(viewType, item)}
							options={{ title: { bold: true, flex: 1 }, text: { bold: false } }}
						/>
					);
				})}

			{viewType === 'soincBottom' &&
				sonicBottom?.map((item) => {
					return (
						<CardLineFiled
							className={clsx('soinc-bottom', item.type)}
							title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
							value={withCommas(item.siseSonic)}
							onClick={() => onClick?.(viewType, item)}
							options={{ title: { bold: true, flex: 1 }, text: { bold: false } }}
						/>
					);
				})}

			{viewType === 'latestBuy' &&
				latestBuy?.map((item) => {
					return (
						<CardLineFiled
							className={clsx('latest-buy')}
							title={`${item.name}`}
							text={`${dayjs(item.sdate).format(DATE_FORMAT)}`}
							value={withCommas(item.sprice)}
							suffix={{ text: '', value: ST.WON }}
							onClick={() => onClick?.(viewType, item)}
							options={{ title: { bold: true, flex: 1 }, text: { bold: false } }}
						/>
					);
				})}

			{viewType === 'latestSell' &&
				latestSell?.map((item) => {
					return (
						<CardLineFiled
							className={clsx('latest-sell', item.type)}
							title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
							text={`${dayjs(item.edate).format(DATE_FORMAT)}`}
							value={withCommas(item.sonic)}
							suffix={{ text: '', value: ST.WON }}
							onClick={() => onClick?.(viewType, item)}
							options={{ title: { bold: true, flex: 1 }, text: { bold: false } }}
						/>
					);
				})}
		</StyledFlex>
	);
};
