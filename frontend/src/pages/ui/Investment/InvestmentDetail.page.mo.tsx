import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import clsx from 'clsx';
import { InvestmentItemType, InvestmentResponse } from '@features/investment/api/investment.dto';
import { useInvestmentHook } from '@features/investment/hook/Investment.hook';
import { InvestmentDetailCard } from '@features/investment/ui/InvestmentDetailCard.ui';
import { InvestmentDetailHeader } from './InvestmentDetailHeader.ui';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { URL } from '@shared/config/url.enum';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { CardListWrap } from '@entites/Card';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card': {
			cursor: 'pointer',
		},
	},
});

export const InvestmentDetailPageMo = ({
	data,
	onClick,
	onRefresh,
	onClickReport,
}: {
	data?: InvestmentResponse;
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
	onRefresh?: (eid?: string, item?: InvestmentItemType) => void;
	onClickReport?: (eid?: string, item?: InvestmentItemType) => void;
}) => {
	const { navigate, param } = useCommonHook();
	const { filteredByCode, naviOptions, selected } = useInvestmentHook(data);
	const { prev, next } = useNaviByOptions({ options: naviOptions, value: param?.id });

	const onClickItem = (eid?: string, item?: InvestmentItemType) => {
		onRefresh?.(eid, item);
	};

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: (dir?: 'next' | 'prev') => {
			if (dir === 'prev') {
				return `${URL.INVEST}/${prev?.value}`;
			} else {
				return `${URL.INVEST}/${next?.value}`;
			}
		},
	});

	const onClickNavi = (value?: string) => {
		navigate(`${URL.INVEST}/${value}`);
	};

	return (
		<StyledPage>
			{/* 타이틀바 */}
			<Flex direction={'column'}>
				<PageTitleBar
					title={ST.INVEST}
					buttonProps={{
						eid: EID.ADD,
						icon: <IconAdd />,
						title: ST.ADD,
						onClick: onClick,
					}}
				/>

				{/* 컨텐츠 헤더(요약) */}
				<InvestmentDetailHeader
					value={selected}
					options={naviOptions}
					data={filteredByCode?.[0]}
					onClickNavi={onClickNavi}
				/>

				{/* 컨텐츠 */}
				<Flex className={clsx(swipeClass, 'contents-layer')} direction={'column'} {...handlerSwipe}>
					<CardListWrap>
						{filteredByCode?.map((item) => {
							return <InvestmentDetailCard data={item} onClick={onClickItem} onClickReport={onClickReport} />;
						})}
					</CardListWrap>
				</Flex>
			</Flex>
		</StyledPage>
	);
};
