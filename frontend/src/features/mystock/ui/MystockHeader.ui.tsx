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
import { IconDown, IconUp } from '@entites/Icons';

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

	'&.bar': {
		// borderTop: '1px solid $gray200'
	},
});

export const MystockHeader = ({
	viewType = 'keep',
	value,
	options,
	keeps,
	sells,
	sise,
	onClickNavi,
}: {
	value?: string;
	viewType?: 'keep' | 'trade';
	options?: OptionType[];
	keeps?: MyStockKeepType[];
	sells?: MyStockSellType[];
	sise?: MyStockSiseItemType;
	onClickNavi?: (value?: string) => void;
}) => {
	console.log({ viewType, value, options, keeps, sells, sise });

	const onClick = (value?: string) => {
		onClickNavi?.(value);
	};

	return (
		<ContentsHeader stickyTop={44}>
			<TitleNavigation withTitleValue height={28} options={options} value={value} onClick={onClick}></TitleNavigation>

			<StyledContents className={clsx(viewType, 'bar')} flex={1}>
				<Flex className={clsx(sise?.updown)} justify={'between'}>
					<Title flex={1} className={clsx('sise')} title={toCost(sise?.sise)} />
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
