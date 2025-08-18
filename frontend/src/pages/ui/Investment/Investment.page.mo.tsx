import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import clsx from 'clsx';
import { InvestmentItemType, InvestmentResponse } from '@features/investment/api/investment.dto';
import { InvestmentCard } from '@features/investment/ui/InvestmentCard.ui';
import { useInvestmentHook } from '@features/investment/hook/Investment.hook';
import { InvestmentHeader } from '@features/investment/ui/InvestmentHeader.ui';
import { CardListWrap } from '@entites/Card';
import { URL } from '@shared/config/url.enum';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { useMemo } from 'react';
import { TitleNavigation } from '@entites/TitleNavigation';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card': {
			cursor: 'pointer',
		},
	},
});

export const InvestmentPageMo = ({
	viewType = 'keep',
	data,
	onClick,
	onRefresh,
}: {
	viewType?: 'keep' | 'nokeep' | 'trade';
	data?: InvestmentResponse;
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
	onRefresh?: (eid?: string, item?: InvestmentItemType) => void;
}) => {
	const { navigate } = useCommonHook();
	const { keeps, nokeeps, trade } = useInvestmentHook(data);

	const naviOptions = useMemo(
		() => [
			{ label: ST.KEEP, value: 'keep' },
			{ label: ST.NO_KEEP, value: 'trade' },
			{ label: ST.NEXT_KEEP, value: 'nokeep' },
		],
		[]
	);

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: (dir?: 'next' | 'prev') => {
			// return `${URL.INVEST}/${viewType === 'keep' ? 'nokeep' : 'keep'}`;
			if (dir === 'prev') {
				return `${URL.INVEST}/${prev?.value}`;
			} else {
				return `${URL.INVEST}/${next?.value}`;
			}
		},
	});

	const { prev, next } = useNaviByOptions({ options: naviOptions, value: viewType });

	const list = useMemo(() => {
		switch (viewType) {
			case 'keep':
				return keeps;
			case 'trade':
				return trade;
			case 'nokeep':
				return nokeeps;
			default:
				keeps;
		}
	}, [keeps, nokeeps, trade, viewType]);

	const onClickItem = (eid?: string, item?: InvestmentItemType) => {
		if (eid === 'refresh') {
			onRefresh?.(eid, item);
		} else {
			onClick?.(eid, item);
		}
	};

	const onClickNavi = (eid?: string) => {
		eid && navigate(`${URL.INVEST}/${eid}`);
	};

	return (
		<StyledPage>
			{/* 타이틀바 */}
			<PageTitleBar
				title={`${ST.INVEST}`}
				buttonProps={{
					eid: EID.ADD,
					icon: <IconAdd />,
					title: ST.ADD,
					onClick: onClick,
				}}
			/>
			{/* 컨텐츠 헤더(요약) */}
			<InvestmentHeader />

			<TitleNavigation sticky stickyTop={144} options={naviOptions} value={viewType} onClick={onClickNavi} />

			{/* 컨텐츠 */}
			<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe}>
				<Flex className={clsx(swipeClass)} direction={'column'}>
					<CardListWrap>
						{list?.map((item) => {
							return <InvestmentCard key={item.rowid} title={item.name} data={item} onClick={onClickItem} />;
						})}
					</CardListWrap>
				</Flex>
			</Flex>
		</StyledPage>
	);
};
