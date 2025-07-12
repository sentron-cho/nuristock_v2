import { Button } from '@entites/Button';
import Flex from '@entites/Flex';
import { IconAdd } from '@entites/Icons';
import { SelectForm } from '@entites/SelectForm';
import { Title } from '@entites/Title';
import { ST } from '@shared/config/kor.lang';
import { styled } from '@styles/stitches.config';
import { useMemo } from 'react';

const StyledFlex = styled(Flex, {
	backgroundColor: '$gray400',
	padding: '$4',
	position: 'sticky',
	marginTop: '$10',
	top: 0,
	zIndex: '1',

	'.title': {
		position: 'absolute',
		width: '100%',
		textAlign: 'center',
	},
});

export const PageTitleBar = ({
	onClick,
	onSelect,
}: {
	onClick: () => void;
	onSelect: (value: string) => void;
}) => {
	const options = useMemo(() => {
		return [
			{ label: ST.DASHBOARD.COST, value: 'keep-cost' },
			{ label: ST.DASHBOARD.PROFIT_AND_LOSS, value: 'sise-sonic' },
			{ label: ST.DASHBOARD.SONIC, value: 'sonic-cost' },
			{ label: ST.DASHBOARD.SONIC_RATE, value: 'sonic-rate' },
			{ label: ST.DASHBOARD.TITLE, value: 'title' },
		];
	}, []);

	return (
		<StyledFlex className='dashboard-titl-bar' justify={'between'}>
			<Title title={ST.DASHBOARD.KEEP_STOCKS} />
			<SelectForm
				size='medium'
				id='select'
				width={180}
				options={options}
				onChange={onSelect}
				defaultValue='keep-cost'
			/>
			<Button size='medium' icon={<IconAdd />} title={'추가'} onClick={onClick} />
		</StyledFlex>
	);
};
