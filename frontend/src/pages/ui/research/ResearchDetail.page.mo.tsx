import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconDelete } from '@entites/Icons';
import clsx from 'clsx';
import { ResearchItemType, ResearchResponse } from '@features/research/api/research.dto';
import { useResearchDetailHook } from '@features/research/hook/Research.hook';
import { ResearchDetailCard } from '@features/research/ui/ResearchDetailCard.ui';
import { CardListWrap } from '@entites/Card';
import { ResearchDetailHeader } from './ResearchDetailHeader.ui';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { URL } from '@shared/config/url.enum';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';
import { useDeleteResearch } from '@features/research/api/research.api';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card': {
			cursor: 'pointer',
		},
	},
});

export const ResearchDetailPageMo = ({
	viewType = 'kospi',
	allList,
	data,
	onClick,
}: {
	viewType: 'kospi' | 'kosdaq' | 'none';
	allList?: ResearchItemType[];
	data?: ResearchResponse;
	onClick?: (eid?: string, item?: ResearchItemType) => void;
}) => {
	const { navigate, param, showConfirm, showToast } = useCommonHook();
	const { list, naviOptions, selected } = useResearchDetailHook(data, allList);
	const { prev, next } = useNaviByOptions({ options: naviOptions, value: param?.id });

	const { mutateAsync: deleteData } = useDeleteResearch();

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: (dir?: 'next' | 'prev') => {
			if (dir === 'prev') {
				return `${URL.RESEARCH}/${viewType}/${prev?.value}`;
			} else {
				return `${URL.RESEARCH}/${viewType}/${next?.value}`;
			}
		},
	});

	const onClickNavi = (value?: string) => {
		navigate(`${URL.RESEARCH}/${viewType}/${value}`);
		onClick?.(EID.DELETE);
	};

	const onClickDelete = () => {
		showConfirm({
			content: ST.WANT_TO_DELETE,
			onClose: async (isOk) => {
				if (isOk && list?.[0]?.code) {
					await deleteData({ code: list?.[0]?.code });
					navigate(`${URL.RESEARCH}/${viewType}/${next?.value}`);
					showToast('info', ST.DELETEED);
				}
			},
		});
	};

	const onClickTitle = () => {
		navigate(`${URL.RESEARCH}/${viewType}`);
	};

	const onClickItem = (eid?: string, item?: ResearchItemType) => {
		if (eid === EID.DELETE) {
			// 개별삭제
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.rowid) {
						await deleteData({ rowid: item?.rowid });
						showToast('info', ST.DELETEED);
						onClick?.(eid, item);
					}
				},
			});
		} else {
			onClick?.(eid, item);
		}
	};

	return (
		<StyledPage>
			{/* 타이틀바 */}
			<Flex direction={'column'}>
				<PageTitleBar
					title={ST.RESEARCH}
					buttonProps={{
						eid: EID.DELETE,
						icon: <IconDelete />,
						onClick: () => onClickDelete(),
					}}
					onClick={() => onClickTitle()}
				/>

				{/* 컨텐츠 헤더(요약) */}
				<ResearchDetailHeader
					value={selected}
					options={naviOptions}
					data={list?.[0]}
					sise={list?.[0]?.sise}
					onClickNavi={onClickNavi}
					onClickSise={() => onClick?.('sise', list?.[0])}
				/>

				{/* 컨텐츠 */}
				<Flex className={clsx(swipeClass, 'contents-layer')} direction={'column'} {...handlerSwipe}>
					<CardListWrap>
						{list?.map((item) => {
							return <ResearchDetailCard key={`in-${item?.rowid}`} data={item} onClick={onClickItem} />;
						})}
					</CardListWrap>
				</Flex>
			</Flex>
		</StyledPage>
	);
};
