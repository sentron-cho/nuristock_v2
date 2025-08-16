import Flex from '@entites/Flex';
import { SubTitle } from '@entites/Title';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import { ProfitItemType } from '../api/profit.dto';
import { styled } from '@styles/stitches.config';
import { RowField } from '@entites/LineRowField';

const StyledFlex = styled(Flex, {
	'.plus': {
		color: '$plus',
	},

	'.minus': {
		color: '$minus',
	},

	'.head, .body': {
		padding: '0 $4',

		'&.bar': {
			borderTop: '1px solid $gray300',
		},
	},

	'.head': {
		height: '40px',
		borderBottom: '1px solid $gray300',

		'.date': {
			color: '$gray700',
		},
	},

	'.body': {
		flex: 1,
	},
});

export const ProfitCardRows = ({
	title,
	className,
	data,
	onClickTitle,
	onClickItem,
	rowHeight = 24,
}: {
	title?: string;
	className?: string;
	data?: ProfitItemType[];
	onClickTitle?: (eid: string) => void;
	onClickItem?: (item: ProfitItemType) => void;
	rowHeight?: string | number;
}) => {
	return (
		<StyledFlex className={clsx('card-field', className)} direction={'column'} gap={10}>
			{title && (
				<Flex className='head' justify={'between'} onClick={() => onClickTitle?.(title)}>
					<SubTitle title={title} width={'100%'} textAlign={'center'} />
				</Flex>
			)}

			<Flex direction={'column'} className='body'>
				{data?.map((item, index) => {
					const { title, sonic, sonicRate, type } = item;
					const updownd = valueOfPlusMinus(sonic, 0);
					const text = sonicRate ? (type === 'dividend' ? `${toCost(sonicRate)}` : `${sonicRate} %`) : '';

					return (
						<RowField
							key={`profit-${index}`}
							type={updownd}
							title={title}
							text={text}
							value={toCost(sonic)}
							onClick={() => onClickItem?.(item)}
							height={rowHeight}
						/>
					);
				})}
			</Flex>
		</StyledFlex>
	);
};
