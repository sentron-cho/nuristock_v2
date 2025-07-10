import { Button } from '@entites/Button';
import Flex from '@entites/Flex';
import { IconClose } from '@entites/Icons';
import { Title } from '@entites/Title';
import {
	Dialog as MuiDialog,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	DialogActions,
	useMediaQuery,
	useTheme,
	IconButton,
} from '@mui/material';
import { styled } from '@styles/stitches.config';
import { PropsWithChildren } from 'react';

const StyledDialog = styled(MuiDialog, {
	'.contents': {
		minHeight: '100px',
		maxHeight: '400px',
	},
});

export const Dialog = ({
	title,
	onClose,
	fullScreen = true,
	children,
}: {
	title?: string;
	onClose: (isOk: boolean) => void;
	fullScreen?: boolean;
} & PropsWithChildren) => {
	const theme = useTheme();
	const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const onOk = () => {
		console.log('[onOk]');
		onClose(true);
	};

	const onCancel = () => {
		console.log('[onCancel]');
		onClose(false);
	};

	return (
		<StyledDialog
			fullScreen={fullScreen && isFullScreen}
			open
			onClose={onCancel}
			aria-labelledby='dialog-box'
			maxWidth='xs'
			fullWidth
		>
			<DialogTitle title={title} onClose={onCancel} />

			<DialogContent dividers>
				<Flex className='contents'>{children}</Flex>
			</DialogContent>

			<DialogActions>
				<DialogButtons onOk={onOk} onCancel={onCancel} />
			</DialogActions>
		</StyledDialog>
	);
};

export const DialogTitle = ({ title, onClose }: { title?: string; onClose?: () => void }) => {
	return (
		<MuiDialogTitle>
			{title && <Title title={title} />}
			{onClose && <IconButton
				aria-label='close'
				onClick={onClose}
				sx={(theme) => ({
					position: 'absolute',
					right: 8,
					top: 8,
					color: theme.palette.grey[500],
				})}
			>
				<IconClose />
			</IconButton>}
		</MuiDialogTitle>
	);
};

export const DialogButtons = ({
	onOk,
	onCancel,
	okText = '저장',
	cancelText = '취소',
}: {
	onOk?: () => void;
	onCancel?: () => void;
	okText?: string;
	cancelText?: string;
}) => {
	return (
		<Flex gap={10} justify={'end'}>
			{onCancel && <Button buttonType='outline' size='medium' title={cancelText} onClick={onCancel} />}
			{onOk && <Button autoFocus size='medium' title={okText} onClick={onOk} />}
		</Flex>
	);
};
