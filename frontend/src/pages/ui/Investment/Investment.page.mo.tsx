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

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card': {
			cursor: 'pointer',
		},
	},
});

export const InvestmentPageMo = ({
	data,
	onClick,
	onRefresh,
}: {
	data?: InvestmentResponse;
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
	onRefresh?: (eid?: string, item?: InvestmentItemType) => void;
}) => {
	const { dataByToday: list } = useInvestmentHook(data);

	const onClickItem = (eid?: string, item?: InvestmentItemType) => {
		if (eid === 'refresh') {
			onRefresh?.(eid, item);
		} else {
			onClick?.(eid, item);
		}
	};

	return (
		<StyledPage>
			{/* 타이틀바 */}
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
			<InvestmentHeader />

			{/* 컨텐츠 */}
			<Flex className={clsx('contents-layer')} direction={'column'}>
				<CardListWrap>
					{list?.map((item) => {
						return <InvestmentCard key={item.rowid} title={item.name} data={item} onClick={onClickItem} />;
					})}
				</CardListWrap>
			</Flex>
		</StyledPage>
	);
};
