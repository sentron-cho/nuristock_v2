import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@stitches/react';
import clsx from 'clsx';

const StyledText = styled(Typography, {

})

export interface TextProps extends TypographyProps {
  text?: string;
  bold?: boolean;
}

export const Text: React.FC<TextProps> = ({
  text,
  className,
  bold,
  ...rest
 }) => {
	return (
    <StyledText
      className={clsx('text', className)}
      fontWeight={bold ? 'bold': rest?.fontWeight}
      {...rest}
    >
			{text}
		</StyledText>
	);
};
