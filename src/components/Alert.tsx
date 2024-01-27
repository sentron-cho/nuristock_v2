import { useEffect } from 'react';
import { Col } from 'reactstrap';
import ReactDom from 'react-dom';
import cs from 'classnames';
import { AlertAlign, AlertType } from '@/types/types';
import { styled } from '@stitches/react';

const StyledAlert = styled('div', {
	padding: '0',
	height: '0',
	margin: '0',

	'& > div': {
		marginTop: '10px',
	},

	'.alert': {
		display: 'flex',
		padding: '8px 10px 8px 20px',
		width: 'fit-content',
		height: '60px',
		maxWidth: '500px',
		minWidth: '360px',
		overflow: 'hidden',
		alignItems: 'center',

		'& > p': {
			overflow: 'hidden',
			maxHeight: '40px',
			margin: 0,
			marginRight: '20px',
			display: '-webkit-box',
			WebkitLineClamp: '2',
			WebkitBoxOrient: 'vertical',
			wordBreak: 'break-all',
			whiteSpace: 'pre',
			textOverflow: 'ellipsis',
		},

		'& > button': {
			padding: '10px',
			marginLeft: '20px',
		},
	},
});

const Alert = ({
	text,
	onClose,
	timeout = 3000,
	type = 'success',
	align = 'right',
}: {
	text: string;
	onClose: () => void;
	timeout?: number;
	type?: AlertType;
	align?: AlertAlign;
}) => {
	const onDismiss = () => {
		onClose();
	};

	useEffect(() => {
		// 타임 아웃이 0이면 자동종료 실행 안함.
		if (timeout === 0) return;

		const timer = setTimeout(() => {
			onClose();
		}, timeout);

		return () => {
			timer && clearTimeout(timer);
		};
	}, []);

	const el = document.getElementById('alert-root') as HTMLElement;

	const alignClass = (align: string) => {
		if (align === 'right') return 'ms-auto';
		else if (align === 'center') return 'm-auto';
		else return '';
	};

	return ReactDom.createPortal(
		<StyledAlert className='row w-100'>
			<Col className={cs('col-auto', alignClass(align))}>
				<div
					className={cs(
						'alert fade show m-0',
						type === 'fail' ? 'alert-danger' : 'alert-success'
					)}
					role='alert'
				>
					<p>{text}</p>

					<button
						type='button'
						className='btn-close ms-auto'
						data-bs-dismiss='alert'
						aria-label='Close'
						onClick={onDismiss}
					></button>
				</div>
			</Col>
		</StyledAlert>,
		el
	);
};

export default Alert;
