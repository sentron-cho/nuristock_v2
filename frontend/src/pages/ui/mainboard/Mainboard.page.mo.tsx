import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import { MainboardHeader } from '@features/main/ui/MainboardHeader.ui';
import { useMainboardHook } from '@features/main/hook/Mainboard.hook';
import { MainboardItemType, MainboardResponse } from '@features/main/api/mainboard.dto';
import { ChartDataType } from '@entites/Chart.type';
import { useMemo } from 'react';
import { reverse, sortBy } from 'lodash';
import { MainboardCard } from '@features/main/ui/MainboardCard.ui';
import { SubTitle } from '@entites/Title';
import { ST } from '@shared/config/kor.lang';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.title-bar': {
			width: '100%',
			background: '$gray400',
			textAlign: 'center',
			height: '40px',
			lineHeight: '40px',
			position: 'sticky',
			top: '240px',
			zIndex: 9,
		},
	},
});

export const MainboardPageMo = ({
	data,
	onClick,
}: {
	data?: MainboardResponse;
	onClick?: (eid?: string, item?: MainboardItemType) => void;
}) => {
	const { totalPrice, keeps } = useMainboardHook(data);

	const parsed = useMemo(() => {
		const list = keeps?.map((a) => ({ name: a?.name, value: a?.kprice, key: a?.code }));

		return reverse(sortBy(list, ['value'])) as ChartDataType[];
	}, [keeps]);

	const onClickChart = (eid: string, value: ChartDataType) => {
		console.log({ eid, value });
	};

	return (
		<StyledPage>
			<Flex direction={'column'} flex={1}>
				{/* 컨텐츠 헤더(요약) */}
				<MainboardHeader data={parsed} value={totalPrice.toString()} onClick={onClickChart} />

				{/* 컨텐츠 */}
				<Flex
					className={clsx('contents-layer')}
					flex={1}
					direction={'column'}
					onClick={() => onClick?.('main')}
				>
					<Flex direction={'column'}>
						{/* 평가 손익 상위 */}
						<Flex className='title-bar' justify={'center'}>
							<SubTitle title={ST.MAINBOARD.SONIC_TOP} />
						</Flex>
						<MainboardCard viewType='soincTop' data={data} onClick={onClick} />

						{/* 평가 손익 하위 */}
						<Flex className='title-bar' justify={'center'}>
							<SubTitle title={ST.MAINBOARD.SONIC_BOTTOM} />
						</Flex>
						<MainboardCard viewType='soincBottom' data={data} onClick={onClick} />

						{/* 최근 매수 상위 */}
						<Flex className='title-bar' justify={'center'}>
							<SubTitle title={ST.MAINBOARD.BUY} />
						</Flex>
						<MainboardCard viewType='latestBuy' data={data} onClick={onClick} />

						{/* 최근 매도 상위 */}
						<Flex className='title-bar' justify={'center'}>
							<SubTitle title={ST.MAINBOARD.SELL} />
						</Flex>
						<MainboardCard viewType='latestSell' data={data} onClick={onClick} />
					</Flex>
				</Flex>
			</Flex>
		</StyledPage>
	);
};
