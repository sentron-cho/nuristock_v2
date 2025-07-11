import Flex from '@entites/Flex';
import Typography from '@mui/material/Typography';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { toCost } from '@shared/libs/utils.lib';

export interface SummaryDataType {
	label: string;
	value: string;
}

const StyledForm = styled(Flex, {
	backgroundColor: '$gray800',
	position: 'sticky',
	color: '$white',
	// borderTop: '1px solid $gray800',
	top: 0,
	left: 0,

	'.container': {
		maxWidth: '$pageWidth',
		margin: 'auto',
	},

	'.li': {
		fontWeight: '400',

		'&:not(:first-child)': {
			borderLeft: '1px solid $gray600',
		},

		'.title': {
			fontSize: '$md',
		},

		'.text': {
			fontSize: '$xs',
		},
	},
});

export const SummaryBar = ({ data, height = '60px' }: { data?: SummaryDataType[]; height?: string | number }) => {
	return (
		<StyledForm className={clsx('stats-form')} css={{ height }}>
			<Flex className='container'>
				{data?.map((item, index) => {
					return (
						<Flex className='li' key={`stats-${index}`}>
							<Flex className='box' direction={'column'}>
								<Typography className='title'>{item.label}</Typography>
								<Typography className='text'>{toCost(item.value)}</Typography>
							</Flex>
						</Flex>
					);
				})}
			</Flex>
		</StyledForm>
	);
};
