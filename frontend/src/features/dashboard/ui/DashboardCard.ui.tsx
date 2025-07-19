import { ST } from '@shared/config/kor.lang';
import { DashboardItemType as DataType, DashboardSiseItemType as SiseType } from '../api/dashboard.dto';
import { valueOfPlusMinus, withCommas } from '@shared/libs/utils.lib';
import Card from '@mui/material/Card';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import Typography from '@mui/material/Typography';
import { IconButton, IconType } from '@entites/IconButton';
import { IconUp, IconDown, IconLaunch } from '@entites/Icons';
import { Button } from '@entites/Button';
import { useMemo } from 'react';
import { EID } from '@shared/config/default.config';
import { Text } from '@entites/Text';
import dayjs from 'dayjs';
import { CardLineFiled } from '@features/common/ui/CardLineField.ui';

const StyledCard = styled(Card, {
	width: '33.33333%',
	height: '280px',
	boxShadow: 'unset !important',
	padding: '$4',

	'&.card': {
		backgroundColor: 'transparent',
		cursor: 'pointer',

		'.box': {
			backgroundColor: '$white',
			borderRadius: '$sm',
			border: '1px solid rgba(0,0,0,0.05)',
			boxShadow: 'var(--Paper-shadow);',
			overflow: 'hidden',
			height: '100%',
			padding: '$4',

			'.head, .foot, .body': {
				padding: '0 $4',
			},

			'.trade-info, .keep-info': {
				'&.keep-info': {
					borderTop: '1px solid $gray300',
				},

				padding: '8px',
			},

			'.head': {
				height: '40px',
				borderBottom: '1px solid $gray300',
			},

			'.body': {
				borderBottom: '1px solid $gray300',
				overflow: 'hidden',
				flex: 1,

				'.b-item': {
					borderTop: '1px solid $gray300',
					paddingTop: '$10',
				},
			},

			'.foot': {
				height: '40px',

				'.naver, .daum': {
					'&.naver': {
						backgroundColor: '#00c73c',
					},
					'&.daum': {
						backgroundColor: '#fcce00',
						color: '$black',
					},
				},

				'.sise': {
					textAlign: 'right',

					'.time': {
						color: '$gray600',
					},

					'.icon': {
						position: 'relative',
						marginLeft: '24px',

						svg: {
							left: '-20px',
							position: 'absolute',
							opacity: '0.8',
						},
					},
				},
			},

			'.plus': {
				color: '$plus',
			},

			'.minus': {
				color: '$minus',
			},
		},

		'&.active': {
			'.box': {
				borderColor: '$gray700',
			},
		},
	},

	'@lg': {
		width: '50%',
	},
	'@md': {
		width: '100%',
	},
});

const LONG_TIME_FORMAT_LENGTH = 8;

export const DashboardCard = ({
	data,
	siseData,
	onClick,
}: {
	data: DataType;
	siseData?: SiseType[];
	onClick?: (eid?: string, item?: DataType) => void;
}) => {
	const handleClick = (eid?: string) => {
		onClick?.(eid, data);
	};

	const sise = useMemo(() => {
		const siseItem = siseData?.find((a) => a.code === data.code);
		// console.log({ siseItem });

		if (!siseItem?.sise) return { total: '', text: '', time: '', price: 0 };

		const siseTotal = data.kcount * (siseItem?.sise || 0);
		const sisePercent = `[${((siseTotal / data.kprice) * 100 - 100).toFixed(0)} %]`;
		const siseText =
			data.kcount > 0 ? `[${withCommas(data?.kcount)} x ${withCommas(siseItem?.sise)}${ST.WON}] ${sisePercent}` : '';
		const siseTitle = siseItem?.time?.length > LONG_TIME_FORMAT_LENGTH ? ST.SISE : ST.SISE_END;

		return {
			// ...siseItem,
			sise: siseItem.sise,
			erate: siseItem.erate,
			ecost: siseItem.ecost,
			updown: siseItem.updown,
			total: `${withCommas(siseTotal)}`,
			text: siseText,
			time: `${siseTitle}(${dayjs(siseItem?.time).format('MM.DD HH:MM')})`,
			price: siseTotal,
		};
	}, [siseData]);

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

	// const icon = sise?.updown === 'down' ? 'arrowdn' : sise?.updown === 'up' ? 'arrowup' : '';

	const handleSiseClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick?.('sise', data);
	};

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
				<Flex gap={8} className='body' direction='column' justify={history ? 'start' : 'center'}>
					{history ? (
						<Flex direction={'column'}>
							{/* 매수/매도/손익 */}
							<Flex className='trade-info' direction='column' align='start' gap={10}>
								<CardLineFiled title={ST.BUY} text={values?.buyText} value={withCommas(data.sprice)} />
								<CardLineFiled title={ST.SELL} text={values?.sellText} value={withCommas(data.eprice)} />
								<CardLineFiled
									className={valueOfPlusMinus(values?.sonic)}
									title={ST.SONIC}
									text={values?.sonicText}
									suffix={{ text: '%', value: ST.WON }}
									value={withCommas(values?.sonic)}
								/>
							</Flex>

							{/* 보유/예상/예상수익 */}
							{active && (
								<Flex className='keep-info' direction='column' align='start' gap={10}>
									<CardLineFiled title={ST.KEEP} text={values?.keepText} value={withCommas(data.kprice)} />
									<CardLineFiled
										title={ST.KEEP_SISE}
										text={sise.text}
										value={sise.total}
										type={values?.stype}
										suffix={{ value: ST.WON }}
									/>
									<CardLineFiled
										title={ST.SELL_SISE}
										value={withCommas(sise.price - data.kprice)}
										type={values?.stype}
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

					{sise && (
						<Flex className={'sise'} direction={'column'} align={'end'} flex={1} gap={8}>
							<Text className='time' text={sise.time} size={'xxs'} />

							<Flex className={clsx('price', type)} gap={4} onClick={handleSiseClick} width={'fit-content'}>
								<Text text={withCommas(sise?.sise)} />
								<Flex className={clsx({ icon: !!sise?.updown })}>
									{sise?.updown === EID.UP && <IconUp fontSize='small' />}
									{sise?.updown === EID.DOWN && <IconDown fontSize='small' />}
									{sise?.erate !== 0 && <Text text={withCommas(sise?.ecost)} />}
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
