import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import { MainboardHeader } from '@features/main/ui/MainboardHeader.ui';
import { useMainboardHook } from '@features/main/hook/Mainboard.hook';
import { MainboardItemType, MainboardResponse } from '@features/main/api/mainboard.dto';
import { ChartDataType } from '@entites/Chart.type';
import { useEffect, useMemo, useState } from 'react';
import { reverse, sortBy } from 'lodash';
import { MainboardCard } from '@features/main/ui/MainboardCard.ui';
import { SubTitle } from '@entites/Title';
import { ST } from '@shared/config/kor.lang';
import { IconButtonToggle } from '@entites/IconButton';
import { IconExpandDown, IconExpandUp } from '@entites/Icons';
import { StorageDataKey, useStorageHook } from '@shared/hooks/useStorage.hook';
import { FieldValues } from 'react-hook-form';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		background: 'white',
	},
});

export const MainboardPageMo = ({
	data,
	onClick,
	onClickTitle,
	onClickChart,
}: {
	data?: MainboardResponse;
	onClick?: (eid?: string, item?: MainboardItemType) => void;
	onClickTitle?: (eid?: string) => void;
	onClickChart?: (eid?: string, item?: ChartDataType) => void;
}) => {
	const { totalPrice, keeps, summaryData, isMoreList, onClickMore } = useMainboardHook(data);

	const parsed = useMemo(() => {
		const list = keeps?.map((a) => ({ name: a?.name, value: a?.kprice, key: a?.code }));

		return reverse(sortBy(list, ['value'])) as ChartDataType[];
	}, [keeps]);

	const { setLocalStorage, getLocalStorage } = useStorageHook();
	const [isShow, setShow] = useState<boolean>(true);

	const stickTop = useMemo(() => (isShow ? 240 : 48), [isShow]);

	useEffect(() => {
		const initConfig = getLocalStorage(StorageDataKey.DASHBOARD_CONFIG_MORE_ALL) as FieldValues;
		if (initConfig) {
			initConfig?.isShow !== undefined && setShow(Boolean(initConfig?.isShow));
		}
	}, []);

	const onClickShow = () => {
		setShow((prev) => !prev);
		setLocalStorage(StorageDataKey.DASHBOARD_CONFIG_MORE_ALL, { isShow: !isShow });
	};

	return (
		<StyledPage summaryData={summaryData}>
			<Flex direction={'column'} flex={1}>
				{/* 컨텐츠 헤더(요약) */}
				<MainboardHeader
					isShow={isShow}
					data={parsed}
					value={totalPrice.toString()}
					onClick={onClickChart}
					onClickShow={onClickShow}
				/>

				{/* 컨텐츠 */}
				<Flex
					className={clsx('contents-layer')}
					flex={1}
					direction={'column'}
					// onClick={() => onClick?.('main')}
				>
					<Flex direction={'column'}>
						{/* 평가 손익 상위 */}
						<ListTitle
							stickyTop={stickTop}
							title={ST.MAINBOARD.SONIC_TOP}
							isMore={isMoreList?.[0]}
							onClickTitle={() => onClickTitle?.('sonicTop')}
							onClickMore={() => onClickMore?.(0, !isMoreList?.[0])}
						/>

						<MainboardCard viewType='sonicTop' isMore={isMoreList?.[0]} data={data} onClick={onClick} />

						{/* 평가 손익 하위 */}
						<ListTitle
							stickyTop={stickTop}
							title={ST.MAINBOARD.SONIC_BOTTOM}
							isMore={isMoreList?.[1]}
							onClickTitle={() => onClickTitle?.('sonicBottom')}
							onClickMore={() => onClickMore?.(1, !isMoreList?.[1])}
						/>
						<MainboardCard viewType='sonicBottom' isMore={isMoreList?.[1]} data={data} onClick={onClick} />

						{/* 최근 매수 상위 */}
						<ListTitle
							stickyTop={stickTop}
							title={ST.MAINBOARD.BUY}
							isMore={isMoreList?.[2]}
							onClickTitle={() => onClickTitle?.('latestBuy')}
							onClickMore={() => onClickMore?.(2, !isMoreList?.[2])}
						/>
						<MainboardCard viewType='latestBuy' isMore={isMoreList?.[2]} data={data} onClick={onClick} />

						{/* 최근 매도 상위 */}
						<ListTitle
							stickyTop={stickTop}
							title={ST.MAINBOARD.SELL}
							isMore={isMoreList?.[3]}
							onClickTitle={() => onClickTitle?.('latestSell')}
							onClickMore={() => onClickMore?.(3, !isMoreList?.[3])}
						/>
						<MainboardCard viewType='latestSell' isMore={isMoreList?.[3]} data={data} onClick={onClick} />

						{/* 매수 손익 상위 */}
						<ListTitle
							stickyTop={stickTop}
							title={ST.MAINBOARD.SONIC_BUY_TOP}
							isMore={isMoreList?.[4]}
							onClickTitle={() => onClickTitle?.('sonicBuyTop')}
							onClickMore={() => onClickMore?.(4, !isMoreList?.[4])}
						/>
						<MainboardCard viewType='sonicBuyTop' isMore={isMoreList?.[4]} data={data} onClick={onClick} />

						{/* 매수 손익 하위 */}
						<ListTitle
							stickyTop={stickTop}
							title={ST.MAINBOARD.SONIC_BUY_BOTTOM}
							isMore={isMoreList?.[5]}
							onClickTitle={() => onClickTitle?.('sonicBuyBottom')}
							onClickMore={() => onClickMore?.(5, !isMoreList?.[5])}
						/>
						<MainboardCard viewType='sonicBuyBottom' isMore={isMoreList?.[5]} data={data} onClick={onClick} />
					</Flex>
				</Flex>
			</Flex>
		</StyledPage>
	);
};

const StyledListTitle = styled(Flex, {
	'&.list-title': {
		position: 'sticky',
		width: '100%',
		background: '$gray400',
		textAlign: 'center',
		height: '40px',
		lineHeight: '40px',
		// top: '240px',
		zIndex: 9,

		'.more': {
			position: 'absolute',
			right: 14,
		},
	},
});

const ListTitle = ({
	stickyTop = 240,
	title,
	isMore,
	onClickMore,
	onClickTitle,
}: {
	stickyTop?: number | string;
	title?: string;
	isMore?: boolean;
	onClickMore?: () => void;
	onClickTitle?: () => void;
}) => {
	return (
		<StyledListTitle className='list-title' justify={'center'} onClick={onClickTitle} style={{ top: stickyTop }}>
			<SubTitle title={title} height={30} />
			<IconButtonToggle
				className='more'
				trueIcon={<IconExpandUp />}
				falseIcon={<IconExpandDown />}
				value={isMore}
				onClick={onClickMore}
			/>
		</StyledListTitle>
	);
};
