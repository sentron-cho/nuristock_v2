import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import clsx from 'clsx';
import { ResearchItemType, ResearchResponse } from '@features/research/api/research.dto';
import { useResearchDetailHook } from '@features/research/hook/Research.hook';
import { ResearchDetailCard } from '@features/research/ui/ResearchDetailCard.ui';
// import { ResearchDetailHeader } from './ResearchDetailHeader.ui';
import { CardListWrap } from '@entites/Card';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card': {
			cursor: 'pointer',
		},
	},
});

export const ResearchDetailPageMo = ({
	data,
	onClick,
}: {
	data?: ResearchResponse;
	onClick?: (eid?: string, item?: ResearchItemType) => void;
}) => {
	const { list } = useResearchDetailHook(data);

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
						onClick: () => onClick?.(EID.ADD, list?.[0]),
					}}
				/>

				{/* 컨텐츠 헤더(요약) */}
				{/* <ResearchDetailHeader
					value={selected}
					options={naviOptions}
					data={filteredByCode?.[0]}
					sise={sise?.find((a) => a?.code === param.id)}
					onClickNavi={onClickNavi}
				/> */}

				{/* 컨텐츠 */}
				<Flex className={clsx('contents-layer')} direction={'column'}>
					<CardListWrap>
						{list?.map((item) => {
							return <ResearchDetailCard key={`in-${item?.rowid}`} data={item} onClick={onClick} />;
						})}
					</CardListWrap>
				</Flex>
			</Flex>
		</StyledPage>
	);
};
