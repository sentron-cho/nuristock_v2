import Flex from '@entites/Flex';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { MyStockKeepType, MyStockSellType, MyStockSiseItemType } from '../api/mystock.dto';
import { OptionType } from '@shared/config/common.type';
import { TitleNavigation } from '@entites/TitleNavigation';
import { Title } from '@entites/Title';
import { toCost } from '@shared/libs/utils.lib';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { Text } from '@entites/Text';
import { EID } from '@shared/config/default.config';
import { IconAddCircle, IconDown, IconUp } from '@entites/Icons';

const StyledContents = styled(Flex, {
	'.up': {
		color: '$plus',
	},
	'.down': {
		color: '$minus',
	},

	'.sise': {
		fontSize: 28,
	},

	'.btn-add': {
		color: '$gray700',
		marginTop: 2,
	},

	'&.bar': {
		// borderTop: '1px solid $gray200'
	},
});

export const MystockHeader = ({
	viewType = 'keep',
	value,
	options,
	// keeps,
	// sells,
	sise,
	onClickNavi,
	onClickAdd,
	onClickTitle,
}: {
	value?: string;
	viewType?: 'keep' | 'trade';
	options?: OptionType[];
	keeps?: MyStockKeepType[];
	sells?: MyStockSellType[];
	sise?: MyStockSiseItemType;
	onClickNavi?: (value?: string) => void;
	onClickAdd?: () => void;
	onClickTitle?: () => void;
}) => {
	const onClick = (value?: string) => {
		onClickNavi?.(value);
	};

	return (
		<ContentsHeader stickyTop={44}>
			{/* 타이틀 및 네비게이션 */}
			<TitleNavigation
				withTitleValue
				height={28}
				options={options}
				value={value}
				onClickTitle={onClickTitle}
				onClick={onClick}
			/>

			{/* 현재가 및 상승율 */}
			<StyledContents className={clsx(viewType, 'bar')} flex={1}>
				<Flex className={clsx('left')} justify={'between'}>
					<Flex flex={1} gap={8} onClick={onClickAdd}>
						<Title className={clsx('sise', sise?.updown)} title={toCost(sise?.sise)} />
						<IconAddCircle className='btn-add' />
					</Flex>

					<Flex flex={1} align={'end'} justify={'center'} direction={'column'}>
						<Flex justify={'end'} gap={4}>
							{sise?.updown === EID.UP && <IconUp fontSize='small' />}
							{sise?.updown === EID.DOWN && <IconDown fontSize='small' />}
							<Text text={toCost(sise?.ecost)} />
						</Flex>
						<Text text={`${sise?.erate} %`} />
					</Flex>
				</Flex>
			</StyledContents>
		</ContentsHeader>
	);
};
