import { MainboardItemType as DataType, MainboardResponse } from '../api/mainboard.dto';
import { valueOfDateDiff, withCommas } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import { useMainboardCardHook } from '../hook/Mainboard.hook';
import { ST } from '@shared/config/kor.lang';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@shared/config/common.constant';
import { RowField } from '@entites/LineRowField';

const StyledFlex = styled(Flex, {
	'&.layout': {
		padding: '$10',
	},
});

export const MainboardCard = ({
	viewType = 'sonicTop',
	isMore = false,
	data,
	onClick,
}: {
	viewType?: 'sonicBuyTop' | 'sonicBuyBottom' | 'sonicTop' | 'sonicBottom' | 'latestSell' | 'latestBuy';
	isMore?: boolean;
	data?: MainboardResponse;
	onClick?: (eid?: string, item?: DataType) => void;
}) => {
	const { sonicTop, sonicBottom, latestBuy, latestSell, sonicBuyTop, sonicBuyBottom } = useMainboardCardHook(data,isMore);

	return (
		<StyledFlex className={clsx('layout')} gap={8} direction={'column'}>
			{/* 평가손익 상위 */}
			{viewType === 'sonicTop' &&
				sonicTop?.map((item, index) => {
					return (
						<RowField
							key={`st-${index}`}
							className={clsx('sonic-top', item.type)}
							title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
							value={withCommas(item.siseSonic)}
							text={`${withCommas(item.sise)}`}
							onClick={() => onClick?.(viewType, item)}
							valueProps={{ bold: true }}
							suffix={{ text: ST.WON, value: ST.WON }}
						/>
					);
				})}

			{/* 평가손실 상위 */}
			{viewType === 'sonicBottom' &&
				sonicBottom?.map((item, index) => {
					return (
						<RowField
							key={`sb-${index}`}
							className={clsx('sonic-bottom', item.type)}
							type={item.type}
							title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
							text={`${withCommas(item.sise)}`}
							value={withCommas(item.siseSonic)}
							onClick={() => onClick?.(viewType, item)}
							valueProps={{ bold: true }}
							suffix={{ text: ST.WON, value: ST.WON }}
						/>
					);
				})}

			{/* 최근매수 상위 */}
			{viewType === 'latestBuy' &&
				latestBuy?.map((item, index) => {
					return (
						<RowField
							key={`lb-${index}`}
							className={clsx('latest-buy', item.type)}
							title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
							text={`${dayjs(item.sdate).format(DATE_FORMAT)}`}
							value={withCommas(item.sonic)}
							onClick={() => onClick?.(viewType, item)}
							valueProps={{ bold: true }}
							suffix={{ value: ST.WON }}
						/>
					);
				})}

			{/* 최근매도 상위 */}
			{viewType === 'latestSell' &&
				latestSell?.map((item, index) => {
					return (
						<RowField
							key={`ls-${index}`}
							className={clsx('latest-sell', item.type)}
							title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
							text={`${dayjs(item.edate).format(DATE_FORMAT)}`}
							value={withCommas(item.sonic)}
							onClick={() => onClick?.(viewType, item)}
							valueProps={{ bold: true }}
							suffix={{ value: ST.WON }}
						/>
					);
				})}

			{/* 매수 손익율 상위 */}
			{viewType === 'sonicBuyTop' &&
				sonicBuyTop?.map((item, index) => {
					return (
						<RowField
							key={`ls-${index}`}
							className={clsx('sonic-buy-top', item.type)}
							title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
							text={`${valueOfDateDiff(item.sdate, new Date())}`}
							// text={`${dayjs(item.sdate).format(DATE_FORMAT)} ${valueOfDateDiff(item.sdate, new Date())}`}
							value={withCommas(item.sonic)}
							onClick={() => onClick?.(viewType, item)}
							valueProps={{ bold: true }}
							suffix={{ value: ST.WON }}
						/>
					);
				})}

			{/* 매수 손실율 상위 */}
			{viewType === 'sonicBuyBottom' &&
				sonicBuyBottom?.map((item, index) => {
					return (
						<RowField
							key={`ls-${index}`}
							className={clsx('sonic-buy-bottom', item.type)}
							title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
							text={`${valueOfDateDiff(item.sdate, new Date())}`}
							// text={`${dayjs(item.sdate).format(DATE_FORMAT)} ${valueOfDateDiff(item.sdate, new Date())}`}
							value={withCommas(item.sonic)}
							onClick={() => onClick?.(viewType, item)}
							valueProps={{ bold: true }}
							suffix={{ value: ST.WON }}
						/>
					);
				})}
		</StyledFlex>
	);
};
