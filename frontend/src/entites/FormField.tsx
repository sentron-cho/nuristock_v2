import { InputLabel } from '@mui/material';
import clsx from 'clsx';
import { Text } from './Text';
import { PropsWithChildren } from 'react';
import { StyledFormField } from './FormField.style';

export interface FormFieldProps extends PropsWithChildren {
	label?: string;
	text?: string | number;
	bold?: boolean;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxs' | 'xxl';
	fontWeight?: string | number;
	className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
	label,
	fontWeight,
	text,
	className,
	bold,
	size = 'sm',
	children,
}) => {
	return (
		<StyledFormField
			direction={'row'}
			className={clsx('form-field', className, size)}
			gap={10}
			justify={'start'}
			align={'center'}
		>
			{label && <InputLabel>{label}</InputLabel>}

			{children ? (
				children
			) : (
				<Text className={clsx('text')} style={{ flex: 1 }} fontWeight={bold ? 'bold' : fontWeight} text={text} />
			)}
		</StyledFormField>
	);
};
