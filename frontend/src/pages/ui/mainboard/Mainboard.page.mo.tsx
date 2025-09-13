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
	onClickChart,
}: {
	data?: MainboardResponse;
	onClick?: (eid?: string, item?: MainboardItemType) => void;
	onClickChart?: (eid?: string, item?: ChartDataType) => void;
}) => {
	const { totalPrice, keeps, summaryData, isMoreList, onClickMore, sortList, onClickSort } = useMainboardHook(data);

	const parsed = useMemo(() => {
		const list = keeps?.map((a) => ({ name: a?.name, value: a?.kprice, key: a?.code }));

		return reverse(sortBy(list, ['value'])) as ChartDataType[];
	}, [keeps]);

	const { setLocalStorage, getLocalStorage } = useStorageHook();
	const [isShow, setShow] = useState<boolean>(true);

	const stickTop = useMemo(() => (isShow ? 258 : 48), [isShow]);

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
					deposit={data?.deposit?.price?.toString()}
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
						{/* 매도 추천 종목 */}
						<ListTitle stickyTop={stickTop} title={ST.MAINBOARD.TARGET_LIST} />
						<MainboardCard viewType='target' data={data} onClick={onClick} />

						{/* 최근 매수/매도 상위 */}
						<ListTitle
							stickyTop={stickTop}
							title={sortList?.[1] === 'asc' ? ST.MAINBOARD.BUY : ST.MAINBOARD.SELL}
							isMore={isMoreList?.[1]}
							onClickTitle={() => onClickSort?.(1, sortList?.[1] === 'asc' ? 'desc' : 'asc')}
							onClickMore={() => onClickMore?.(1, !isMoreList?.[1])}
						/>
						<MainboardCard
							viewType='latest'
							isMore={isMoreList?.[1]}
							data={data}
							onClick={(eid, item) => onClick?.(sortList?.[1] === 'asc' ? eid : 'latestSell', item)}
							sortType={sortList?.[1]}
						/>

						{/* 평가 손익/손실 상위 */}
						<ListTitle
							stickyTop={stickTop}
							title={sortList?.[0] === 'asc' ? ST.MAINBOARD.SONIC_TOP : ST.MAINBOARD.SONIC_BOTTOM}
							isMore={isMoreList?.[0]}
							onClickTitle={() => onClickSort?.(0, sortList?.[0] === 'asc' ? 'desc' : 'asc')}
							onClickMore={() => onClickMore?.(0, !isMoreList?.[0])}
						/>
						<MainboardCard
							viewType='sonic'
							isMore={isMoreList?.[0]}
							data={data}
							onClick={onClick}
							sortType={sortList?.[0]}
						/>

						{/* 매수 손익/손실 상위 */}
						<ListTitle
							stickyTop={stickTop}
							title={sortList?.[2] === 'asc' ? ST.MAINBOARD.SONIC_BUY_TOP : ST.MAINBOARD.SONIC_BUY_BOTTOM}
							isMore={isMoreList?.[2]}
							onClickTitle={() => onClickSort?.(2, sortList?.[2] === 'asc' ? 'desc' : 'asc')}
							onClickMore={() => onClickMore?.(2, !isMoreList?.[2])}
						/>
						<MainboardCard
							viewType='sonicBuy'
							isMore={isMoreList?.[2]}
							data={data}
							onClick={onClick}
							sortType={sortList?.[2]}
						/>
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
			{onClickMore && (
				<IconButtonToggle
					className='more'
					trueIcon={<IconExpandUp />}
					falseIcon={<IconExpandDown />}
					value={isMore}
					onClick={onClickMore}
				/>
			)}
		</StyledListTitle>
	);
};
