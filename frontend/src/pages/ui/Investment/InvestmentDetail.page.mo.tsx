import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAddPlaylist } from '@entites/Icons';
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
import { Button } from '@entites/Button';
import { useMemo } from 'react';
import { InvestmentChart } from '@features/investment/ui/InvestmentChart.ui';

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
}: {
	data?: InvestmentResponse;
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
}) => {
	const { navigate, param } = useCommonHook();
	const { filteredByCode, naviOptions, selected, sise } = useInvestmentHook(data);
	const { prev, next } = useNaviByOptions({ options: naviOptions, value: param?.id });

	const lastItem = useMemo(() => {
		return filteredByCode?.[filteredByCode?.length - 1];
	}, [filteredByCode]);

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
						buttonType: 'icon',
						eid: EID.ADD,
						icon: <IconAddPlaylist />,
						onClick: () => onClick?.(EID.ADD, filteredByCode?.[0]),
					}}
				/>

				{/* 컨텐츠 헤더(요약) */}
				<InvestmentDetailHeader
					value={selected}
					options={naviOptions}
					data={filteredByCode?.[0]}
					sise={sise?.find((a) => a?.code === param.id)}
					onClickNavi={onClickNavi}
				/>

				{/* 차트 */}
				<InvestmentChart data={filteredByCode} />

				{/* 컨텐츠 */}
				<Flex className={clsx(swipeClass, 'contents-layer')} direction={'column'} {...handlerSwipe}>
					<CardListWrap>
						{filteredByCode?.map((item) => {
							return <InvestmentDetailCard key={`in-${item?.rowid}`} data={item} onClick={onClick} />;
						})}
					</CardListWrap>

					<Flex style={{ padding: '8px 4px' }}>
						<Button
							fullWidth
							title={`${Number(lastItem?.sdate) - 1}${ST.YEAR} ${ST.ADD}`}
							onClick={() => onClick?.(EID.INSERT, { ...lastItem, sdate: `${Number(lastItem?.sdate) - 1}` })}
						/>
					</Flex>
				</Flex>
			</Flex>
		</StyledPage>
	);
};
