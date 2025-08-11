import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import { MyStockKeepType, MyStockResponse, MyStockSellType } from '@features/mystock/api/mystock.dto';
import { MyStcokKeepList, MyStcokTradeList } from '@features/mystock/ui/MyStockCard.ui';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import { URL } from '@shared/config/url.enum';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import Flex from '@entites/Flex';
import { useMyStockHook } from '@features/mystock/hook/MyStock.hook';
import clsx from 'clsx';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { MystockHeader } from '@features/mystock/ui/MystockHeader.ui';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';
import { colors } from '@mui/material';

const StyledPage = styled(PageContainer, {
	'.page-titl-bar': {
		'.box': {
			'.btn.right': {
				marginTop: 4,
				fontSize: '16px',
				color: '$gray500',
				// opacity: 0.8,
			},
		},
	},

	'.btn-add': {
		color: '$gray700',
	},

	'.contents-layer': {
		'.card': {
			'&.keep': {
				cursor: 'pointer',
			},

			'.box': {
				'.trade-info, .keep-info, .cast-info': {
					'&.keep-info, &.cast-info': {
						borderTop: '1px solid $gray300',
					},

					padding: '8px',
				},
			},
		},

		'.trade-layer': {
			'.trade-sub-title': {
				width: '100%',
				background: '$gray400',
				textAlign: 'center',
				height: '40px',
				lineHeight: '40px',
				position: 'sticky',
				top: '144px',
				zIndex: 9,

				'.sum': {
					'&.plus': {
						color: '$plus',
					},

					'&.minus': {
						color: '$minus',
					},
				},
			},

			'@md': {
				'.trade-sub-title': {
					justifyContent: 'space-between',
					padding: '0 10px',
				},
			},
		},
	},
});

export const MyStockPageMo = ({
	viewType,
	data,
	onClickKeep,
	onClickTrade,
}: {
	viewType?: 'keep' | 'trade';
	data?: MyStockResponse;
	onClickKeep?: (eid?: string, item?: MyStockKeepType) => void;
	onClickTrade?: (eid?: string, item?: MyStockSellType) => void;
}) => {
	const { navigate, param } = useCommonHook();
	const { keepList, tradeList, selected, summaryData, naviOptions, sise } = useMyStockHook(data, viewType);
	const { prev, next } = useNaviByOptions({ options: naviOptions, value: param?.id });

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: (dir?: 'next' | 'prev') => {
			if (dir === 'prev') {
				return `${URL.MYSTOCK}/${viewType}/${prev?.value}`;
			} else {
				return `${URL.MYSTOCK}/${viewType}/${next?.value}`;
			}
		},
	});

	const onClick = (value?: string) => {
		navigate(`${URL.MYSTOCK}/${viewType}/${value}`);
	};

	const onClickHead = () => {
		navigate(`${URL.MYSTOCK}/${viewType === 'keep' ? 'trade' : 'keep'}/${param?.id}`);
	};

	return (
		<>
			<StyledPage summaryData={summaryData}>
				<Flex direction={'column'} flex={1}>
					{/* 타이틀바 */}
					<PageTitleBar
						title={viewType === 'keep' ? ST.KEEP_LIST : ST.TRADE_LIST}
						buttonProps={{
							eid: 'buy',
							title: viewType === 'keep' ? ST.TRADE_LIST : ST.KEEP_LIST,
							buttonType: 'text',
							color: 'primary',
							onClick: onClickHead,
						}}
					/>

					{/* 컨텐츠 헤더(요약) */}
					<MystockHeader
						viewType={viewType}
						value={selected}
						options={naviOptions}
						keeps={keepList}
						sells={tradeList}
						sise={sise}
						onClickNavi={onClick}
						onClickAdd={() => onClickKeep?.('buy')}
					/>

					{/* 컨텐츠 */}
					<Flex className='contents-layer' direction={'column'} {...handlerSwipe}>
						{viewType === 'keep' && (
							<Flex className={clsx(swipeClass)} direction={'column'}>
								{/* 보유현황 */}
								{!!keepList?.length && <MyStcokKeepList list={keepList} sise={data?.sise} onClick={onClickKeep} />}
							</Flex>
						)}

						{viewType === 'trade' && (
							<Flex className={swipeClass} direction={'column'}>
								{/* 거래내역 */}
								{!!tradeList?.length && <MyStcokTradeList list={tradeList} sise={data?.sise} onClick={onClickTrade} />}
							</Flex>
						)}
					</Flex>
				</Flex>
			</StyledPage>
		</>
	);
};
