import { Button } from '@entites/Button';
import Flex from '@entites/Flex';
import { IconAdd } from '@entites/Icons';
import { SelectForm } from '@entites/SelectForm';
import { Title } from '@entites/Title';
import { styled } from '@styles/stitches.config';
import { useMemo } from 'react';
import { ST } from '@shared/config/default.config';

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

export const DashboardTitleBar = ({
	onClick,
	onSelect,
}: {
	onClick: () => void;
	onSelect: (value: string) => void;
}) => {
	const options = useMemo(() => {
		return [
			{ label: '보유금액', value: 'keep-cost' },
			{ label: '예상손익', value: 'sise-sonic' },
			{ label: '손익금액', value: 'sonic-cost' },
			{ label: '손익율', value: 'sonic-rate' },
			{ label: '제목', value: 'title' },
		];
	}, []);

	return (
		<StyledFlex className='dashboard-titl-bar' justify={'between'}>
			<Title title={ST.KEEP_STOCKS} />
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
