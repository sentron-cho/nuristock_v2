import { styled } from '@stitches/react';
import { SvgIconProps } from '@mui/material';

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
import IconClear from '@mui/icons-material/Clear';
import IconSearch from '@mui/icons-material/Search';
import IconRefresh from '@mui/icons-material/Refresh';
import IconArrowCircleUp from '@mui/icons-material/ArrowCircleUp';
import IconArrowCircleDown from '@mui/icons-material/ArrowCircleDown';
import IconArrowLeft from '@mui/icons-material/ArrowLeft';
import IconArrowRight from '@mui/icons-material/ArrowRight';

import IconHome from '@mui/icons-material/Home'; // 홈
import IconDiary from '@mui/icons-material/EventNote'; // 다이어리
import IconSonic from '@mui/icons-material/Assessment'; // 투자손익
// import IconStockSearch from '@mui/icons-material/AutofpsSelect'; // 종목검색
import IconStockSearch from '@mui/icons-material/QueryStats';
// import IconDividend from '@mui/icons-material/AutoMode'; // 배당
import IconDividend from '@mui/icons-material/CreditScore'; // 배당
import IconInvest from '@mui/icons-material/Balance'; // 가치투자

import IconExpandUp from '@mui/icons-material/ExpandLess';
import IconExpandDown from '@mui/icons-material/ExpandMore';

import IconRemoveCircle from '@mui/icons-material/RemoveCircle';
import IconAddCircle from '@mui/icons-material/AddCircle';

import IconAddBox from '@mui/icons-material/AddBox';
import IconRemoveBox from '@mui/icons-material/IndeterminateCheckBox';

import IconAddPlaylist from '@mui/icons-material/PlaylistAdd';
import IconRemovePlaylist from '@mui/icons-material/PlaylistRemove';

import IconMoreHori from '@mui/icons-material/MoreHoriz';
import IconMoreVert from '@mui/icons-material/MoreVert';

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
	IconArrowLeft,
	IconArrowRight,
	IconClear,
	IconSearch,
	IconRefresh,
	IconArrowCircleUp,
	IconArrowCircleDown,
	IconHome,
	IconDiary,
	IconSonic,
	IconStockSearch,
	IconDividend,
	IconInvest,
	IconExpandUp,
	IconExpandDown,
	IconRemoveCircle,
	IconAddCircle,
	IconRemoveBox,
	IconAddBox,
	IconAddPlaylist,
	IconRemovePlaylist,
	IconMoreHori,
	IconMoreVert
};
