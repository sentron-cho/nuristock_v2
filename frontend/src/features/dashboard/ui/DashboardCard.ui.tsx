import { ST } from '@shared/config/kor.lang';
import { DashboardItemType as DataType, DashboardSiseItemType as SiseType } from '../api/dashboard.dto';
import { valueOfPlusMinus, withCommas } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import Typography from '@mui/material/Typography';
import { IconButton, IconType } from '@entites/IconButton';
import { IconUp, IconDown, IconLaunch } from '@entites/Icons';
import { Button } from '@entites/Button';
import { useMemo } from 'react';
import { EID } from '@shared/config/default.config';
import { Text } from '@entites/Text';
import dayjs from 'dayjs';
import { CardLineFiled } from '@features/common/ui/CardLineField.ui';
import { StyledCard } from '../style/DashboardCard.style';

const LONG_TIME_FORMAT_LENGTH = 8;

export const DashboardCard = ({
	viewType = 'keep',
	data,
	siseData,
	sortType,
	onClick,
	isFullDisplay = true,
}: {
	viewType?: 'keep' | 'trade';
	data: DataType;
	siseData?: SiseType[];
	sortType?: string;
	onClick?: (eid?: string, item?: DataType) => void;
	isFullDisplay?: boolean;
}) => {
	const sise = useMemo(() => {
		const siseItem = siseData?.find((a) => a.code === data.code);

		if (!siseItem?.sise) return { total: '', text: '', time: '', price: 0 };

		const siseTotal = data.kcount * (siseItem?.sise || 0);
		const sisePercent = `[${((siseTotal / data.kprice) * 100 - 100).toFixed(0)} %]`;
		const siseText =
			data.kcount > 0 ? `[${withCommas(data?.kcount)} x ${withCommas(siseItem?.sise)}${ST.WON}] ${sisePercent}` : '';
		const siseTitle = siseItem?.stime?.length > LONG_TIME_FORMAT_LENGTH ? ST.SISE : ST.SISE_END;

		return {
			// ...siseItem,
			sise: siseItem.sise,
			erate: siseItem.erate,
			ecost: siseItem.ecost,
			updown: siseItem.updown,
			total: `${withCommas(siseTotal)}`,
			text: siseText,
			time: `${siseTitle}(${dayjs(siseItem?.stime).format('MM.DD HH:mm')})`,
			price: siseTotal,
		};
	}, [siseData, data]);

	const values = useMemo(() => {
		const buyAvg = data?.ecount ? Math.round(data.sprice / data.ecount) : 0;
		const buyText = data?.ecount ? `${withCommas(data.ecount)} x ${withCommas(buyAvg)}` : '';

		const sellAvg = data?.ecount ? Math.round(data.eprice / data.ecount) : 0;
		const sellText = data?.ecount ? `${withCommas(data.ecount)} x ${withCommas(sellAvg)}` : '';

		const keepAvg = data.kcount ? Math.round(data.kprice / data.kcount) : 0;
		const keepText = data.kcount ? `${withCommas(data.kcount)} x ${withCommas(keepAvg)}` : '';

		const sonic = data.eprice - data.sprice;
		const sonicText = sonic !== 0 ? `${((data.eprice / data.sprice) * 100 - 100).toFixed(0)}` : '';

		const stype = valueOfPlusMinus(sise.price, data.kprice);

		return {
			buyAvg,
			buyText,
			sellAvg,
			sellText,
			keepAvg,
			keepText,
			sonic,
			sonicText,
			stype,
		};
	}, [data]);

	const type = valueOfPlusMinus(values?.sonic);
	const active = data.kprice > 0;
	const history = data.sprice || data.kprice;
	const siseUpdown = valueOfPlusMinus(sise.ecost);

	const handleSiseClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick?.('sise', data);
	};

	const handleClick = (eid?: string) => {
		onClick?.(eid, data);
	};

	const isBottomShow = useMemo(() => {
		if (viewType === 'keep' && isFullDisplay) return true;
		else if (viewType === 'trade') return true;
		else return false;
	}, [viewType, isFullDisplay]);

	return (
		<StyledCard className={clsx('card', { active }, type, { sm: !history })}>
			<Flex className='box' direction='column' onClick={() => handleClick(EID.SELECT)}>
				{/* head */}
				<Flex className='head' justify='between'>
					<Flex gap={4} className='left' flex={1}>
						<Typography fontWeight={'bold'} className='title'>
							{data.name}
						</Typography>
						<Typography fontWeight={'bold'} className='code'>
							{data.code}
						</Typography>
					</Flex>
					<Flex gap={4} className='right' width='fit-contents'>
						<IconButton eid='delete' type={IconType.DELETE} onClick={handleClick} />
						<IconButton eid='edit' type={IconType.EDIT} onClick={handleClick} />
					</Flex>
				</Flex>

				{/* body */}
				<Flex gap={8} className={clsx('body', sortType)} direction='column' justify={history ? 'start' : 'center'}>
					{history ? (
						<Flex direction={'column'}>
							{/* 보유/예상/예상수익 */}
							{viewType === 'keep' && (
								<Flex className='keep-info' direction='column' align='start'>
									<CardLineFiled
										className={clsx('keep-cost')}
										title={ST.KEEP}
										text={values?.keepText}
										value={withCommas(data.kprice)}
									/>
									<CardLineFiled
										title={ST.KEEP_SISE}
										text={sise.text}
										value={sise.total}
										type={values?.stype}
										suffix={{ value: ST.WON }}
									/>
									<CardLineFiled
										title={ST.SISE_SONIC}
										value={withCommas(sise.price - data.kprice)}
										type={values?.stype}
									/>
								</Flex>
							)}

							{/* 매수/매도/손익 */}
							{isBottomShow && (
								<Flex className='trade-info' direction='column' align='start'>
									<CardLineFiled title={ST.BUY} text={values?.buyText} value={withCommas(data.sprice)} />
									<CardLineFiled title={ST.SELL} text={values?.sellText} value={withCommas(data.eprice)} />
									<CardLineFiled
										className={clsx(valueOfPlusMinus(values?.sonic))}
										title={ST.SONIC}
										text={values?.sonicText}
										suffix={{ text: '%', value: ST.WON }}
										value={withCommas(values?.sonic)}
									/>
								</Flex>
							)}
						</Flex>
					) : (
						<div className='noitem'>{ST.NO_HISTORY}</div>
					)}
				</Flex>

				{/* foot */}
				<Flex className='foot' justify={'between'}>
					{/* 네이버, 다음 버튼 */}
					<Flex gap={8} width={200}>
						<Button
							className='naver'
							eid='naver'
							icon={<IconLaunch />}
							size='small'
							title='Naver'
							onClick={handleClick}
						/>
						<Button className='daum' eid='daum' icon={<IconLaunch />} size='small' title='Daum' onClick={handleClick} />
					</Flex>

					{/* 시세 정보 표시 */}
					{sise && sise?.sise && (
						<Flex className={'sise'} direction={'column'} align={'end'} flex={1} gap={8}>
							<Text className='time' text={sise.time} size={'xxs'} />

							<Flex className={clsx('price', siseUpdown)} gap={4} onClick={handleSiseClick} width={'fit-content'}>
								<Text text={withCommas(sise?.sise)} />
								<Flex className={clsx({ icon: !!sise?.updown })}>
									{sise?.updown === EID.UP && <IconUp fontSize='small' />}
									{sise?.updown === EID.DOWN && <IconDown fontSize='small' />}
									{sise?.ecost !== undefined && <Text text={withCommas(sise?.ecost)} />}
								</Flex>
								<Text text={`(${sise?.erate}%)`} />
							</Flex>
						</Flex>
					)}
				</Flex>
			</Flex>
		</StyledCard>
	);
};
