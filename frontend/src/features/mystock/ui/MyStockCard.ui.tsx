import { ST } from '@shared/config/kor.lang';
import {
	MyStockKeepType as KeepType,
	MyStockSellType as SellType,
	MyStockSiseItemType as SiseType,
} from '../api/mystock.dto';
import { valueOfPlusMinus } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import { Button } from '@entites/Button';
import { EID } from '@shared/config/default.config';
import { IconButton, IconType } from '@entites/IconButton';
import Flex from '@entites/Flex';
import { KeepContents, TradeContents } from './MyStockCardContents.ui';
import { StyledCard } from '../style/MyStockCard.style';

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
