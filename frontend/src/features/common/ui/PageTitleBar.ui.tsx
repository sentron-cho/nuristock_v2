import { Button, ButtonProps } from '@entites/Button';
import Flex from '@entites/Flex';
import { SelectForm, SelectFormProps } from '@entites/SelectForm';
import { Title } from '@entites/Title';
import { styled } from '@styles/stitches.config';

const StyledFlex = styled(Flex, {
	backgroundColor: '$gray400',
	padding: '$4',
	position: 'sticky',
	marginTop: '$10',
	top: 0,
	zIndex: '999',

	'.title': {
		position: 'absolute',
		width: '100%',
		textAlign: 'center',
	},

	'.plus': {
		color: '$plus',
	},

	'.minus': {
		color: '$minus',
	}
});

interface PageTitleBarProps {
	title?: string;
	titleProps?: {
		className?: string;
	};
	selectProps?: SelectFormProps;
	buttonProps?: ButtonProps;
}

export const PageTitleBar: React.FC<PageTitleBarProps> = ({ title, buttonProps, selectProps, titleProps }) => {
	return (
		<StyledFlex className='dashboard-titl-bar' justify={'between'}>
			{title && <Title title={title} className={titleProps?.className || ''} />}
			{selectProps && (
				<SelectForm
					{...selectProps}
					size='medium'
					width={selectProps?.width || 140}
					// onChange={selectProps?.onSelect}
					// options={selectProps?.options}
					// defaultValue={selectProps?.defaultValue}
				/>
			)}
			{buttonProps && (
				<Button
					{...buttonProps}
					size='medium'
					// icon={<IconAdd />}
					// title={buttonTitle}
					// onClick={onClick}
				/>
			)}
		</StyledFlex>
	);
};
