import { FC, useMemo } from 'react';
import { ChartLegend } from '@entites/ChartLegend';
import { CHART_COLORS, ChartDataType, ColoredSlice } from '@entites/Chart.type';
import { ChartDonut } from '@entites/ChartDonut';
import { ST } from '@shared/config/kor.lang';
import { styled } from '@styles/stitches.config';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { toSemiCost } from '@shared/libs/utils.lib';
import { IconButtonToggle } from '@entites/IconButton';
import { IconZoomIn, IconZoomOut } from '@entites/Icons';
import { SubTitle } from '@entites/Title';
import { Text } from '@entites/Text';

type MainboardHeaderProps = {
	data: ChartDataType[];
	height?: number;
	title?: string;
	value?: string;
	deposit?: string;
	valueFormatter?: (v: number) => string;
	onClick?: (eid: string, item?: ColoredSlice) => void;
	isShow?: boolean;
	onClickShow?: (isShow?: boolean) => void;
};

const DEFAULT_COLORS = Object.values(CHART_COLORS);

const StyledHeader = styled(ContentsHeader, {
	'&.mainboard-header': {
		'.box': {
			border: '1px solid $primaryhover',
		},

		'.more-all': {
			position: 'absolute',
			left: 14,
			zIndex: 1,
		},

		'.bar-chart': {
			width: '100%',
			backgroundColor: '$gray200',

			'.bar-box': {
				height: '100%',
				color: 'white',

				'.bar-1': {
					height: '100%',
					backgroundColor: '$redhover',
				},
				'.bar-2': {
					height: '100%',
					backgroundColor: '$primaryhover',
				},
			},
		},
	},
});

export const MainboardHeader: FC<MainboardHeaderProps> = ({
	isShow,
	onClickShow,
	data,
	title = ST.ASSET,
	value,
	deposit,
	onClick,
}) => {
	const total = useMemo(() => data.reduce((acc, cur) => acc + (cur.value || 0), 0), [data]);

	const withColor: ColoredSlice[] = useMemo(
		() =>
			data.map((d, i) => ({
				...d,
				color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
				label: `${(total ? (d.value / total) * 100 : 0).toFixed(1)}%`,
			})),
		[data, total]
	);

	const rate = useMemo(() => {
		const totalPrice = Number(total || 0) + Number(deposit || 0);
		return { deposit: (Number(deposit || 0) / totalPrice * 100).toFixed(0), price: (Number(total || 0) / totalPrice * 100).toFixed(0) };
	}, [total, deposit]);

	return (
		<StyledHeader className={clsx('mainboard-header')} stickyTop={0} height={'fit-content'}>
			<IconButtonToggle
				className='more-all'
				trueIcon={<IconZoomIn />}
				falseIcon={<IconZoomOut />}
				value={isShow}
				onClick={onClickShow}
			/>

			{!isShow && (
				<Flex className='title-bar' justify={'center'}>
					<SubTitle title={ST.MAINBOARD.SUMMARY} height={30} />
				</Flex>
			)}

			{isShow && (
				<Flex height={240} direction={'column'}>
					<Flex height={200}>
						{/* 왼쪽: 도넛 */}
						<ChartDonut
							data={withColor}
							width={'50%'}
							title={title}
							value={value}
							onClickTitle={() => onClick?.('title')}
							onClickSlice={(value) => onClick?.('slice', value)}
						/>

						{/* 오른쪽: 범례 */}
						<ChartLegend
							data={withColor}
							valueFormatter={(v) => toSemiCost(v)}
							onClick={(v) => onClick?.('legend', v)}
						/>
					</Flex>
					<Flex className='bar-chart' height={30} direction={'column'} gap={2}>
						<Flex className='bar-box' direction={'row'} height={20}>
							<Flex className='bar-1' style={{ width: `${rate?.price}%` }} justify={'center'}>
								<Text size='xs' text={`${rate?.price}%`} />
							</Flex>
							<Flex className='bar-2' style={{ width: `${rate?.deposit}%` }} justify={'center'}>
								<Text size='xs' text={`${rate?.deposit}%`} />
							</Flex>
						</Flex>
						<Flex className='bar-label' height={14}>
							<Text size='xxs' className='plus' text={`${toSemiCost(total)}(${rate?.price}%)`} flex={1} textAlign={'center'}/>
							<Text size='xxs' className='minus' text={`${toSemiCost(deposit)}(${rate?.deposit}%)`} flex={1} textAlign={'center'}/>
						</Flex>
					</Flex>
				</Flex>
			)}
		</StyledHeader>
	);
};
