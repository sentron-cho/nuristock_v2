import IconDelete from '@mui/icons-material/Delete';
import IconEdit from '@mui/icons-material/EditDocument';

export { IconDelete, IconEdit };

export enum IconType {
	DELETE = 'delete',
	EDIT = 'edit',
}

export const SvgIcon = ({ type, eid, onClick, ...props }: { type: IconType; eid?: string, onClick?: (eid: string) => void }) => {
  const onClickIcon = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(eid || type);
  }

	if (type === IconType.DELETE) return <IconDelete {...props} onClick={onClickIcon}/>;
	else if (type === IconType.EDIT) return <IconEdit {...props} onClick={onClickIcon}/>;
};
