import IconDelete from '@mui/icons-material/Delete';
import IconEdit from '@mui/icons-material/EditDocument';
import IconLaunch from '@mui/icons-material/Launch';
import IconLink from '@mui/icons-material/Link';
import IconAdd from '@mui/icons-material/Add';
import IconClose from '@mui/icons-material/Close';
import IconAlert from '@mui/icons-material/ErrorOutline';
import IconArrowUp from '@mui/icons-material/ArrowUpward';
import IconArrowDown from '@mui/icons-material/ArrowDownward';
import IconPlayArrow from '@mui/icons-material/PlayArrow';
import { styled } from '@stitches/react';
import { SvgIconProps } from '@mui/material';

const StyledUp = styled(IconPlayArrow, {
	color: '$plus',
	transform: 'rotate(-90deg)',
	marginTop: '2px',
});

const StyledDown = styled(IconPlayArrow, {
	color: '$minus',
	transform: 'rotate(90deg)',
	marginTop: '-2px',
});

const IconUp = (props: SvgIconProps) => {
	return <StyledUp {...props} />;
};

const IconDown = (props: SvgIconProps) => {
	return <StyledDown {...props} />;
};

export {
	IconPlayArrow,
	IconDelete,
	IconEdit,
	IconLaunch,
	IconLink,
	IconAdd,
	IconClose,
	IconAlert,
	IconUp,
	IconDown,
	IconArrowUp,
	IconArrowDown,
};