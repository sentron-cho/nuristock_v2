import IconDelete from '@mui/icons-material/Delete';
import IconEdit from '@mui/icons-material/EditDocument';
import IconLaunch from '@mui/icons-material/Launch';
import IconLink from '@mui/icons-material/Link';
import IconAdd from '@mui/icons-material/Add';
import IconClose from '@mui/icons-material/Close';
import IconAlert from '@mui/icons-material/ErrorOutline';
import IconArrowUp from '@mui/icons-material/ArrowDropUp';
import IconArrowDown from '@mui/icons-material/ArrowDropDown';
import IconUp from '@mui/icons-material/ArrowUpward';
import IconDown from '@mui/icons-material/ArrowDownward';
import IconPlayArrow from '@mui/icons-material/PlayArrow';

export { IconPlayArrow, IconDelete, IconEdit, IconLaunch, IconLink, IconAdd, IconClose, IconAlert, IconUp, IconDown, IconArrowUp, IconArrowDown };

// export enum IconType {
// 	DELETE = 'delete',
// 	EDIT = 'edit',
// 	LAUNCH = 'launch',
// 	LINK = 'link',
// }

// export const SvgIcon = ({ type, eid, onClick, ...props }: { type: IconType; eid?: string, onClick?: (eid: string) => void }) => {
//   const onClickIcon = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onClick?.(eid || type);
//   }

// 	if (type === IconType.DELETE) return <IconDelete {...props} onClick={onClickIcon}/>;
// 	else if (type === IconType.EDIT) return <IconEdit {...props} onClick={onClickIcon}/>;
// 	else if (type === IconType.LAUNCH) return <IconLaunch {...props} onClick={onClickIcon}/>;
// 	else if (type === IconType.LINK) return <IconLink {...props} onClick={onClickIcon}/>;
// };
