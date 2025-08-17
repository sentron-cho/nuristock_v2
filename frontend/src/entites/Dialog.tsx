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
	DialogProps as MuiDialogProps,
} from '@mui/material';
import { styled } from '@styles/stitches.config';
import { PropsWithChildren, useEffect } from 'react';
import { FieldValues } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const StyledDialog = styled(MuiDialog, {
	'&.dialog-popup': {
		'zIndex': '$dialog',

		'.contents': {
			minHeight: '100px',
			// maxHeight: '400px',
			height: '100%',
		},
	
		'.MuiDialog-paperFullScreen': {
			'.MuiDialogContent-root': {
				padding: '20px 10px',
				overflow: 'hidden',
	
				'.contents': {
					height: 'clac(100vh - 140px)',
					maxHeight: 'unset',
				},
			},
		},
	}
});

interface DialogProps extends Omit<MuiDialogProps, 'open'> {
	title?: string;
	onClose: (isOk: boolean) => void;
	fullScreen?: boolean;
	backdrop?: boolean;
}

export interface PopupType {
	type: 'add' | 'edit' | 'append' | string;
	item?: FieldValues;
	onClose: (isOk: boolean, item?: FieldValues) => void;
}

export const Dialog = ({
	title,
	onClose,
	fullScreen = true,
	children,
	backdrop = false,
	...props
}: DialogProps & PropsWithChildren) => {
	const theme = useTheme();
	const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
	
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// 팝업이 열릴 때 현재 위치에 dummy state를 추가
		navigate(location.pathname, { replace: false, state: { modal: true } });

		// 브라우저 뒤로가기 시 팝업 닫기
		const handlePopState = () => {
			location?.state?.modal && navigate(-1); // push로 넣었던 dummy state pop
			onClose?.(false);
		};

		// popstate 이벤트 수동으로 감지
		window.addEventListener('popstate', handlePopState);

		return () => {
			// 언마운트 시 이벤트 제거
			window.removeEventListener('popstate', handlePopState);
		};
	}, []);

	const onOk = () => {
		onClose(true);
	};

	const onCancel = () => {
		onClose(false);
		navigate(-1); // push로 넣었던 dummy state pop
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // 기본 폼 제출 방지
			onOk();
		}
	};

	return (
		<StyledDialog
			className='dialog-popup'
			fullScreen={fullScreen && isFullScreen}
			onClose={backdrop ? onCancel : undefined}
			aria-labelledby='dialog-box'
			maxWidth='xs'
			fullWidth
			open={true}
			onKeyDown={handleKeyDown}
			{...props}
		>
			<DialogTitle title={title} onClose={onCancel} />

			<DialogContent dividers>
				<Flex className='contents' direction={'column'}>
					{children}
				</Flex>
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
			{onClose && (
				<IconButton
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
				</IconButton>
			)}
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
