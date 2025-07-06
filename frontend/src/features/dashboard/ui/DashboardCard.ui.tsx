import { ST } from 'src/types/kor.lang';
import { DashboardResponse as DataType, StockSiseResponse as SiseType } from '../api/useSelectDashboard.hook';
import { toCost, valueOfPlusMinus, withCommas } from 'src/libs/utils.lib';
import { EID } from 'src/types/default.config';
import Card from '@mui/material/Card';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import Typography from '@mui/material/Typography';
import { IconButton, IconType } from '@entites/IconButton';

const StyledCard = styled(Card, {
	width: '400px',
	height: '280px',

	'.card': {
		// backgroundColor: '$gray700',
		border: '1px solid $gray500',
		overflow: 'hidden',
		height: '100%',

		'& > div': {
			padding: '$4 $10',
			width: '100%',
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
        paddingTop: '$10'
      }
		},
		'.foot': {
			height: '40px',
		},

		'.plus': {
			color: '$plus',
    },
    '.minus': {
			color: '$minus',
		},
	},
});

export const DashboardCard = ({
	data,
	siseData,
	onClick,
}: {
	data: DataType;
	siseData?: SiseType;
	onClick?: (eid: string, item?: DataType) => void;
}) => {
	console.log({ data, siseData });

	const onClickCard = (eid: string) => {
		onClick?.(eid, data);
	};

	const onClickButton = (eid: string, e: React.MouseEvent) => {
		e.stopPropagation();
		onClick?.(eid, data);
	};

	const makeSise = (item: DataType): { total: string; text: string; time: string; price: number } => {
		if (item.stime) {
			const siseTotal = item.kcount * (item?.sise || 0);
			const sisePercent = `[${((siseTotal / item.kprice) * 100 - 100).toFixed(0)} %]`;
			const siseText =
				item.kcount > 0 ? `[${withCommas(item.kcount)} x ${withCommas(item.sise)} ${ST.WON}] ${sisePercent}` : '';
			const siseTitle = item?.stime && item.stime.length > 8 ? ST.SISE : ST.SISE_END;
			const siseTime = item?.stime; //&& item?.stime?.length <= 8 ? toStringSymbol(item.stime.substring(4, 4)) : Util.toStringSymbol(item.stime).substr(5, 11);

			return {
				total: `${withCommas(siseTotal)} ${ST.WON}`,
				text: siseText,
				time: `${siseTitle}(${siseTime})`,
				price: siseTotal,
			};
		}

		return { total: '', text: '', time: '', price: 0 };
	};

	const buyAvg = Math.round(data.sprice / data.ecount);
	const buyText = data.ecount > 0 ? `[${withCommas(data.ecount)} x ${withCommas(buyAvg)} ${ST.WON}]` : '';
	const sellAvg = Math.round(data.eprice / data.ecount);
	const sellText = data.ecount > 0 ? `[${withCommas(data.ecount)} x ${withCommas(sellAvg)} ${ST.WON}]` : '';
	const keepAvg = Math.round(data.kprice / data.kcount);
	const keepText = data.kcount > 0 ? `[${withCommas(data.kcount)} x ${withCommas(keepAvg)} ${ST.WON}]` : '';
	const sonic = data.eprice - data.sprice;
	const sonicText = sonic !== 0 ? `[${((data.eprice / data.sprice) * 100 - 100).toFixed(0)} %]` : '';
	const type = valueOfPlusMinus(sonic);
	const sise = makeSise(data);
	const stype = valueOfPlusMinus(sise.price as number, data.kprice);
	const active = data.kprice > 0;
	const history = data.sprice || data.kprice;
	const icon = data.updown === 'down' ? 'arrowdn' : data.updown === 'up' ? 'arrowup' : '';

	const onClickSise = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick?.('sise', data);
	};

	return (
		<StyledCard className={clsx({ active }, !history && 'sm', type)}>
			<Flex className='card' direction={'column'} onClick={() => onClickCard('card')}>
				<Flex className={'head'} justify={'between'}>
					<Flex gap={4} className={'left'} flex={1}>
						<Typography className='title'>{data.name}</Typography>
						<Typography className='code'>{data.code}</Typography>
					</Flex>
					<Flex gap={4} className='right' width={'fit-contents'}>
						<IconButton type={IconType.DELETE} onClick={onClick} />
						<IconButton type={IconType.EDIT} onClick={onClick} />
					</Flex>
				</Flex>
				<Flex gap={8} className={'body'} direction={'column'} justify={'start'}>
					{history ? (
						<>
							<Flex className='t-item' direction={'column'} align={'start'}>
								<CoItem title={ST.BUY} text={buyText} value={withCommas(data.sprice)} />
								<CoItem title={ST.SELL} text={sellText} value={withCommas(data.eprice)} />
								<CoItem
									className={valueOfPlusMinus(sonic)}
									title={ST.SONIC}
									text={sonicText}
									value={withCommas(sonic)}
								/>
							</Flex>
							{active && (
								<Flex className='b-item' direction={'column'} align={'start'}>
									<CoItem title={ST.KEEP} text={keepText} value={withCommas(data.kprice)} />
									<CoItem title={ST.KEEP_SISE} text={sise.text} value={sise.total} type={stype} />
									<CoItem title={ST.SELL_SISE} value={withCommas(sise.price - data.kprice)} type={stype} />
								</Flex>
							)}
						</>
					) : (
						<div className={'noitem'}>{ST.DASHBOARD.NO_HISTORY}</div>
					)}
				</Flex>
				<Flex className={'foot'}>
					<span className='st-time'>{sise.time}</span>
					<div className='grp-l'>
						{/* <Button
							className='btn-info green xs'
							icon={'link'}
							title={ST.DASHBOARD.NAVER}
							onClick={onClickButton}
							eid={'naver'}
						/>
						<Button
							className='btn-daum yellow xs'
							icon={'link'}
							title={ST.DASHBOARD.DAUM}
							onClick={onClickButton}
							eid={'daum'}
						/> */}
					</div>
					<div className={clsx('grp-r')} onClick={onClickSise}>
						<span className={clsx('st-value', data.updown)}>
							{`${withCommas(data.sise)}`}
							{icon && <IconButton type={IconType.DELETE} onClick={onClick} />}
							{data?.erate !== 0 ? `${withCommas(data.ecost)}` : ''}
						</span>
						<span className={clsx('st-rate md', data.updown)}>{`(${data.erate}%)`}</span>
					</div>
				</Flex>
			</Flex>
		</StyledCard>
	);
};

const StyledColItem = styled(Flex, {
	fontSize: '$sm',

	'.left': {
		flex: 1,
	},

	'.right': {
		textAlign: 'right',
		width: '140px',
		fontSize: '$xs',
	},
});

export const CoItem = ({
	title,
	type,
	date,
	value,
	text,
	suffix = ST.WON,
	className,
}: {
	title: string;
	type?: string;
	date?: string;
	value?: string | number;
	text?: string;
	suffix?: string;
	className?: string;
}) => {
	return (
		<StyledColItem className={clsx('col', type, className)} justify={'between'}>
			<Flex gap={10} className='left'>
				<Typography fontSize={'small'} className='title'>
					{title}
				</Typography>
				<span className='middle'>
					{text && (
						<Typography fontSize={'small'} className='text'>
							{text}
						</Typography>
					)}
					{date && <Typography fontSize={'small'} className={'date'}>{`[${date}]`}</Typography>}
				</span>
			</Flex>
			<Flex className='right' gap={2} justify={'end'}>
				<Typography fontSize={'small'}>{value}</Typography>
				{suffix && <Typography fontSize={'small'}>{suffix}</Typography>}
			</Flex>
		</StyledColItem>
	);
};
