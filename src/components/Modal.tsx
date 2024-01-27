import { Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { str } from '@/langs/common.langs';
import cs from 'classnames';
import { Modal as ModalBox } from 'reactstrap';
import { styled } from '@stitches/react';

export const StyledModal = styled(ModalBox, {
	margin: '0 !important',
	height: '100vh !important',
	width: '100vw !important',
	minWidth: '100vw !important',
	minHeight: '100vh !important',
	overflow: 'hidden !important',

	'.modal-content': {
		overflow: 'hidden',
		margin: 'auto',
	},

	'.modal-header': {
		borderBottom: 'none',
		height: '60px',

		'.title .btn-close:focus': {
			boxShdow: 'unset',
		},
	},

	'.modal-body': {
		padding: '10px 30px',

		div: {
			pre: {
				overflowX: 'hidden',
				overflowY: 'auto',
				textWrap: 'balance',
				wordBreak: 'break-all',
				padding: '10px 20px',
			},
		},
	},

	'.modal-footer': {
		padding: '0px 30px',
		height: '70px',
	},

	variants: {
		height: {
			true: {
				'.modal-content': {
					height: '$$height !important',
				},
			},
			// false: {},
		},
		width: {
			true: {
				'.modal-content': {
					width: '$$width !important',
				},
			},
			// false: {},
		},
		size: {
			sm: {
				'.modal-content': {
					height: '280px',
					width: '380px',
				},
			},
			md: {
				'.modal-content': {
					height: '400px',
					width: '560px',
				},
			},
			lg: {
				'.modal-content': {
					height: '480px',
					width: '800px',
				},
			},
			xl: {
				'.modal-content': {
					height: '700px',
					width: '1200px',
				},
			},
			xxl: {
				'.modal-content': {
					height: '820px',
					width: '1440px',
				},
			},
			full: {
				'.modal-content': {
					height: '100vh',
					width: '100vw',
				},
			},
		},
		overflow: {
			auto: {
				'.modal-body': {
					overflow: 'auto',
				},
			},
			hidden: {
				'.modal-body': {
					overflow: 'hidden',
				},
			},
			visible: {
				'.modal-body': {
					overflow: 'visible',
				},
			},
		},
		align: {
			top: { '.modal-content': { marginTop: '60px' } },
			center: {},
		},
		type: {
			info: {},
			error: {
				'.modal-header': {
					color: '$light',
					background: '$danger',
				},

				'.modal-content': {
					border: 'none',
					background: '$dark',
					color: '$danger',
				},

				'.modal-body': {
					padding: '0',
				},
			},
			warn: {
				'.modal-header': {
					background: '$warning',
				},

				'.modal-content': {
					border: 'none',
				},
			},
		},
	},
});

const Modal = ({
	backdrop = 'static',
	children,
	title = '',
	onClose,
	header = true,
	footer = false,
	size = 'md',
	buttonAlign = 'center',
	align = 'center',
	buttonTitle,
	type = 'info',
	overflow = 'hidden',
	className,
	height,
	width,
	headerChildren,
}: {
	children: string | React.ReactNode;
	onClose: (isok: boolean, values?: object) => void;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';
	backdrop?: 'static' | boolean;
	title?: string;
	header?: boolean;
	footer?: boolean;
	buttonAlign?: 'center' | 'left' | 'right' | string;
	align?: 'center' | 'top';
	buttonTitle?: string;
	type?: 'info' | 'warn' | 'error';
	overflow?: 'hidden' | 'visible';
	className?: string;
	height?: string;
	width?: string;
	headerChildren?: React.ReactNode;
}) => {
	const getHeight = () => {
		return `calc(100% - ${header ? '60px' : 0} - ${footer ? '70px' : 0})`;
	};

	const css = (width?: string, height?: string) => {
		let style = {};

		height && (style = { ...style, $$height: `${height}` });
		width && (style = { ...style, $$width: `${width}` });

		return style;
	};
	return (
		<StyledModal
			isOpen={true}
			toggle={() => onClose(false)}
			backdrop={backdrop}
			size={size}
			className={cs(
				{ 'modal-dialog-centered': align === 'center' },
				{ 'modal-fullscreen': size === 'full' },
				className
			)}
			align={align}
			type={type}
			overflow={overflow}
			height={!!height}
			width={!!width}
			css={css(width, height)}
		>
			{header ? (
				<ModalHeader toggle={() => onClose(false)}>
					{headerChildren ? (
						headerChildren
					) : (
						<span className='mx-2 fw-bold'>{title}</span>
					)}
				</ModalHeader>
			) : (
				<div className='mt-4'></div>
			)}
			<ModalBody style={{ height: getHeight() }}>{children}</ModalBody>
			{footer ? (
				<ModalFooter
					className='border-top-0 mb-2'
					style={{
						justifyContent: buttonAlign,
					}}
				>
					<Button
						color='primary'
						size='md'
						className='col-12'
						onClick={() => onClose(true)}
						// style={{ padding: '6px 80px' }}
					>
						{buttonTitle || str.modal.ok}
					</Button>
				</ModalFooter>
			) : (
				<div className='mt-4'></div>
			)}
		</StyledModal>
	);
};

export default Modal;
