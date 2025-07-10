import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogButtons } from './Dialog.ui';
import { useState } from 'react';

export const Alert = ({
  title,
  text,
  onClose
}: {
  title?: string;
  text?: string;
  onClose?: () => void
}) => {
	const onClickClose = () => {
		onClose?.();
	};

	return (
		<Dialog
			open
			onClose={onClickClose}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{title}</DialogTitle>

			<DialogContent>
				<DialogContentText id='alert-dialog-description'>{text}</DialogContentText>
			</DialogContent>

			<DialogActions>
				<DialogButtons onOk={onClose} okText='확인' />
			</DialogActions>
		</Dialog>
	);
};
