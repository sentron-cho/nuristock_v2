import Flex from '@entites/Flex';
import Typography from '@mui/material/Typography';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { toCost } from '@shared/libs/utils.lib';
import { useEffect, useMemo, useState } from 'react';
import { isEqual } from 'lodash';

export interface SummaryDataType {
	id: string;
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

		'&.hover': {
			cursor: 'pointer',
		},
		'&.active': {
			color: '$warning',
		},

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

export const SummaryBar = ({
	data,
	height = '60px',
	onClick,
}: {
	data?: SummaryDataType[];
	height?: string | number;
	onClick?: (item: SummaryDataType) => void;
}) => {
	const [active, setActive] = useState<string>();
	const [ids, setIds] = useState<string[]>();

	useEffect(() => {
		const curIds = data?.map((a) => a.id);
		!isEqual(ids, curIds) && setIds(data?.map((a) => a.id));
	}, [data]);

	useEffect(() => setActive(ids?.length ? ids?.[0] : ''), [ids]);

	const onClickItem = (item: SummaryDataType) => {
		setActive(item.id);
		onClick?.(item);
	};

	return (
		<StyledForm className={clsx('stats-form')} css={{ height }}>
			<Flex className='container'>
				{data?.map((item, index) => {
					return (
						<Flex
							key={`stats-${index}`}
							className={clsx('li', { hover: !!onClick, active: onClick && active === item?.id })}
							onClick={() => onClickItem(item)}
						>
							<Flex className='box' direction={'column'}>
								<Typography className='title'>{item.label}</Typography>
								<Typography className='text' height={18}>
									{item.value ? toCost(item.value) : ''}
								</Typography>
							</Flex>
						</Flex>
					);
				})}
			</Flex>
		</StyledForm>
	);
};
