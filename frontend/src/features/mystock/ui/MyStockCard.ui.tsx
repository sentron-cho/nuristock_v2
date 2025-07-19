import { ST } from '@shared/config/kor.lang';
import {
	MyStockKeepType as KeepType,
	MyStockSellType as SellType,
	MyStockSiseItemType as SiseType,
} from '../api/mystock.dto';
import { valueOfPlusMinus } from '@shared/libs/utils.lib';
import Card from '@mui/material/Card';
import clsx from 'clsx';
import { styled } from '@styles/stitches.config';
import { Button } from '@entites/Button';
import { EID } from '@shared/config/default.config';
import { IconButton, IconType } from '@entites/IconButton';
import Flex from '@entites/Flex';
import { KeepContents, TradeContents } from './MyStockCardContents.ui';

const StyledCard = styled(Card, {
	width: '33.33333%',
	height: '240px',
	boxShadow: 'unset !important',
	padding: '$4',

	'&.card': {
		backgroundColor: 'transparent',
		'&.keep': {
			cursor: 'pointer',
			height: '300px',
		},

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

			'.trade-info, .keep-info, .cast-info': {
				'&.keep-info, &.cast-info': {
					borderTop: '1px solid $gray300',
				},

				padding: '8px',
			},

			'.head': {
				height: '40px',
				borderBottom: '1px solid $gray300',

				'.date': {
					color: '$gray700',
				},
			},

			'.body': {
				borderBottom: '1px solid $gray300',
				overflow: 'hidden',
				flex: 1,
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

export const MyStockCard = ({
	data,
	sise,
	viewType,
	onClick,
}: {
	data: KeepType | SellType;
	sise?: SiseType;
	viewType: 'keep' | 'trade';
	onClick?: (eid?: string, item?: KeepType | SellType) => void;
}) => {
	const handleClick = (eid?: string) => {
		onClick?.(eid, data);
	};

	const type = valueOfPlusMinus(sise?.sise, data.scost);

	// const handleSiseClick = (e: React.MouseEvent) => {
	// 	e.stopPropagation();
	// 	onClick?.('sise', data);
	// };

	return (
		<StyledCard className={clsx('card', type, viewType, { sm: !history })}>
			<Flex className='box' direction='column' onClick={() => handleClick(EID.SELECT)}>
				{viewType === 'keep' && <KeepContents data={data as KeepType} sise={sise} />}
				{viewType === 'trade' && <TradeContents data={data as SellType} />}

				<Flex className='foot' justify={'between'}>
					<Flex gap={8} style={{ visibility: viewType === 'keep' ? 'visible' : 'hidden' }}>
						<Button eid='sell' size='small' title={ST.SELL} onClick={handleClick} />
						{/* <Button eid='calc' size='small' title={ST.CALC} onClick={handleClick} /> */}
					</Flex>
					<Flex gap={8} fullWidth={false}>
						<IconButton type={IconType.EDIT} eid='edit' onClick={handleClick} />
						<IconButton type={IconType.DELETE} eid='delete' onClick={handleClick} />
					</Flex>
				</Flex>
			</Flex>
		</StyledCard>
	);
};
