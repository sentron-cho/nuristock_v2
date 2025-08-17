import { Button } from '@entites/Button';
import Flex from '@entites/Flex';
import { IconExpandDown, IconExpandUp, IconMoreHori, IconMoreVert, IconZoomIn, IconZoomOut } from '@entites/Icons';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { ST } from '@shared/config/kor.lang';
import { useAppConfigHook } from '@shared/hooks/useAppConfig.hook';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RowField } from '@entites/LineRowField';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@shared/config/common.constant';
import { valueOfDateDiff, withCommas } from '@shared/libs/utils.lib';
import { useSelectMainboard } from '@features/main/api/mainboard.api';
import { useDashboardHeaderHook } from '../hook/DashboardHeader.hook';
import { SubTitle } from '@entites/Title';
import { IconButtonToggle } from '@entites/IconButton';
import { styled } from '@styles/stitches.config';

const StyledHeader = styled(ContentsHeader, {
	'&.contents-header': {
		// borderBottom: '2px solid $primaryhover',
		'.box': {
			border: '1px solid $primaryhover',
		},

		'.more-all': {
			position: 'absolute',
			left: 14,
		},

		'.title-bar': {
			'.more': {
				position: 'absolute',
				right: 14,
			},
		},
	},
});

export const DashboardHeader = ({
	onClick,
	// data,
}: {
	// data?: DashboardResponse;
	onClick?: (eid: string, value: unknown) => void;
}) => {
	const formContext = useFormContext();
	const { createConfig } = useAppConfigHook({ group: 'dashboard' });
	const [isMoreUp, setMoreUp] = useState<boolean>(formContext?.getValues('more') ?? true);

	const { data } = useSelectMainboard();
	const {
		buy,
		sonic,
		isShow,
		isMoreBuy,
		isMoreSonic,
		isShowConfig,
		onClickShow,
		onClickMoreBuy,
		onClickMoreSonic,
		onClickShowConfig,
	} = useDashboardHeaderHook(data);

	const onClickMore = () => {
		const value = !isMoreUp;

		setMoreUp(value);
		onClick?.('more', value);
		formContext?.setValue('more', value);
		createConfig({ skey: 'more', svalue: value?.toString() });
	};

	return (
		<StyledHeader stickyTop={44}>
			<IconButtonToggle
				className='more-all'
				trueIcon={<IconZoomIn />}
				falseIcon={<IconZoomOut />}
				value={isShow}
				onClick={onClickShow}
			/>

			{!isShow && (
				<Flex className='title-bar' justify={'center'}>
					<SubTitle title={ST.MAINBOARD.SUMMARY} height={30} />
				</Flex>
			)}

			{isShow && (
				<Flex direction={'column'}>
					{/* 요약 정보 */}
					<Flex direction={'column'} gap={4}>
						{/* 최근 매수 상위 */}
						<Flex direction={'column'}>
							<Flex className='title-bar' justify={'center'}>
								<SubTitle title={ST.MAINBOARD.BUY} height={30} />
								<IconButtonToggle
									className='more'
									trueIcon={<IconExpandUp />}
									falseIcon={<IconExpandDown />}
									value={isMoreBuy}
									onClick={onClickMoreBuy}
								/>
							</Flex>
							{buy?.map((item, index) => {
								return (
									<RowField
										key={`lb-${index}`}
										className={clsx('latest-buy', item.type)}
										title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
										text={`${dayjs(item.sdate).format(DATE_FORMAT)}`}
										value={withCommas(item.sonic)}
										onClick={() => onClick?.('latest-buy', item)}
										valueProps={{ bold: true }}
										suffix={{ value: ST.WON }}
									/>
								);
							})}
						</Flex>

						{/* 매수 손익 상위 */}
						<Flex direction={'column'}>
							<Flex className='title-bar' justify={'center'}>
								<SubTitle title={ST.MAINBOARD.SONIC_BUY_TOP} height={30} />
								<IconButtonToggle
									className='more'
									trueIcon={<IconExpandUp />}
									falseIcon={<IconExpandDown />}
									value={isMoreSonic}
									onClick={onClickMoreSonic}
								/>
							</Flex>
							{sonic?.map((item, index) => {
								return (
									<RowField
										key={`ls-${index}`}
										className={clsx('sonic-buy', item.type)}
										title={`${item.name} [${item.sonicRate.toFixed(1)}%]`}
										text={`${valueOfDateDiff(item.sdate, new Date())}`}
										// text={`${dayjs(item.sdate).format(DATE_FORMAT)} ${valueOfDateDiff(item.sdate, new Date())}`}
										value={withCommas(item.sonic)}
										onClick={() => onClick?.('sonic-buy', item)}
										valueProps={{ bold: true }}
										suffix={{ value: ST.WON }}
									/>
								);
							})}
						</Flex>

						<Flex justify={'end'}>
							<IconButtonToggle
								trueIcon={<IconMoreHori />}
								falseIcon={<IconMoreVert />}
								value={isShowConfig}
								onClick={onClickShowConfig}
							/>
						</Flex>

						{/* 요약보기/전체보기 */}
						{isShowConfig && (
							<Flex justify={'start'}>
								<Flex className='more' fullWidth={false} onClick={onClickMore}>
									{isMoreUp && <Button icon={<IconExpandUp />} iconPosition='end' title={ST.MORE_IN} />}
									{!isMoreUp && <Button icon={<IconExpandDown />} iconPosition='end' title={ST.MORE_OUT} />}
								</Flex>
							</Flex>
						)}
					</Flex>
				</Flex>
			)}
		</StyledHeader>
	);
};
