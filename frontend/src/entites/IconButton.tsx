import IconDelete from '@mui/icons-material/Delete';
import IconEdit from '@mui/icons-material/EditDocument';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';

export { IconDelete, IconEdit };

export enum IconType {
	DELETE = 'delete',
	EDIT = 'edit',
}

const StyledIconButton = styled('span', {
  cursor: 'pointer',
  display: 'flex',
})

export const IconButton = ({
	type,
	eid,
	disabled = false,
	onClick,
	className,
	...props
}: {
	type: IconType;
	eid?: string;
	disabled?: boolean;
	className?: string;
	onClick?: (eid: string) => void;
}) => {
	const onClickIcon = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick?.(eid || type);
	};

	return (
		<StyledIconButton className={clsx('icon-button', className, { disabled })} onClick={onClickIcon}>
			{type === IconType.DELETE && <IconDelete {...props} />}
			{type === IconType.EDIT && <IconEdit {...props} />}
		</StyledIconButton>
	);

	// if (type === IconType.DELETE) return <IconDelete {...props} onClick={onClickIcon} />;
	// else if (type === IconType.EDIT) return <IconEdit {...props} onClick={onClickIcon} />;
};
