import { TypographyProps } from '@mui/material';
import clsx from 'clsx';
import { StyledText } from './Text.style';

export interface TextProps extends TypographyProps {
	text?: string | number;
	bold?: boolean;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxs' | 'xxl';
}

export const Text: React.FC<TextProps> = ({ text, className, bold, size = 'sm', ...rest }) => {
	return (
		<StyledText
			className={clsx('text', className, size)}
			fontWeight={bold ? 'bold' : rest?.fontWeight}
			// fontSize={size}
			{...rest}
		>
			{text}
		</StyledText>
	);
};
