import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import clsx from 'clsx';
import { DashboardHeader } from '@features/dashboard/ui/DashboardHeader.ui';
import { InvestmentItemType } from '@features/investment/api/investment.dto';
import { useInvestmentHook } from '@features/investment/hook/Investment.hook';
import { useMemo } from 'react';
import { sortedByKey } from '@shared/libs/sort.lib';
import { InvestmentDetailCard } from '@features/investment/ui/InvestmentDetailCard.ui';

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
}: {
	data?: InvestmentItemType[];
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
	onRefresh?: (eid?: string, item?: InvestmentItemType) => void;
}) => {
	const { groupedByName } = useInvestmentHook(data);

	const list = useMemo(() => {
		return groupedByName && sortedByKey(Object.entries(groupedByName), 'title', true);
	}, [groupedByName]);

	const onClickItem = (eid?: string, item?: InvestmentItemType) => {
		onRefresh?.(eid, item);
	};

	console.log(list);

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
				<DashboardHeader />

				{/* 컨텐츠 */}
				<Flex className={clsx('contents-layer')} direction={'column'}>
					{list?.map((item) => {
						return <InvestmentDetailCard title={item?.[0]} data={item?.[1]} onClick={onClickItem} />;
					})}
				</Flex>
			</Flex>
		</StyledPage>
	);
};
