import { styled } from '@stitches/react';
import { SvgIconProps } from '@mui/material';

import IconHome from '@mui/icons-material/Home'; // 홈
import IconDashboard from '@mui/icons-material/Dashboard'; // 대시보드
import IconDiary from '@mui/icons-material/EventNote'; // 다이어리
// import IconSonic from '@mui/icons-material/Addchart';  // 투자손익
import IconSonic from '@mui/icons-material/EmojiTransportation';
import IconStockSearch from '@mui/icons-material/QueryStats';
import IconDividend from '@mui/icons-material/CreditScore'; // 배당
import IconInvest from '@mui/icons-material/Balance'; // 가치투자
import IconAsset from '@mui/icons-material/AssuredWorkload'; // 투자금
import IconDeposit from '@mui/icons-material/CurrencyExchange'; // 예수금
import IconBucket from '@mui/icons-material/AdsClick'; // 버킷
import IconResearch from '@mui/icons-material/Troubleshoot'; // 투자조사
// import IconStatistic from '@mui/icons-material/Assessment'; // 통계
import IconStatistic from '@mui/icons-material/Addchart'; // 통계

import IconDelete from '@mui/icons-material/Delete';
import IconEdit from '@mui/icons-material/DriveFileRenameOutline';
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

import IconExpandUp from '@mui/icons-material/ExpandLess';
import IconExpandDown from '@mui/icons-material/ExpandMore';

import IconRemoveCircle from '@mui/icons-material/RemoveCircle';
import IconAddCircle from '@mui/icons-material/AddCircle';

import IconAddBox from '@mui/icons-material/AddBox';
import IconRemoveBox from '@mui/icons-material/IndeterminateCheckBox';
import IconRemove from '@mui/icons-material/DeleteOutline';

import IconAddPlaylist from '@mui/icons-material/PlaylistAdd';
import IconRemovePlaylist from '@mui/icons-material/PlaylistRemove';

import IconMoreHori from '@mui/icons-material/MoreHoriz';
import IconMoreVert from '@mui/icons-material/MoreVert';

import IconEditDocument from '@mui/icons-material/EditDocument';
import IconDescription from '@mui/icons-material/Description';
import IconDocument from '@mui/icons-material/DocumentScanner';

import IconForward from '@mui/icons-material/Forward';
import IconRedo from '@mui/icons-material/Redo';
import IconUndo from '@mui/icons-material/Undo';

import IconMenu from '@mui/icons-material/Menu';
import IconMenuOpen from '@mui/icons-material/MenuOpen';
import IconTune from '@mui/icons-material/Tune';

import IconMoreSettings from '@mui/icons-material/SettingsEthernet';

import IconZoomIn from '@mui/icons-material/ZoomInMap';
import IconZoomOut from '@mui/icons-material/ZoomOutMap';
import IconStarFill from '@mui/icons-material/Star';
import IconStarOutline from '@mui/icons-material/StarBorder';

import IconFavoriteFill from '@mui/icons-material/Favorite';
import IconFavoriteOutline from '@mui/icons-material/FavoriteBorder';


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
	IconMoreVert,
	IconEditDocument,
	IconDescription,
	IconDocument,
	IconForward,
	IconUndo,
	IconRedo,
	IconAsset,
	IconDeposit,
	IconDashboard,
	IconMenu,
	IconMenuOpen,
	IconTune,
	IconMoreSettings,
	IconZoomIn,
	IconZoomOut,
	IconBucket,
	IconResearch,
	IconStarOutline,
	IconStarFill,
	IconStatistic,
	IconFavoriteFill,
	IconFavoriteOutline,
	IconRemove
};
