import {
	Button,
	Modal as ModalBox,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from 'reactstrap';
import { str } from '@/langs/common.langs';
import cs from 'classnames';

const Confirm = ({
	onClose,
	children,
	size = 'sm',
	backdrop = 'static',
	title = '',
	text = '',
	header = true,
	buttonTitle,
	buttonAlign = 'center',
	align = 'center',
	showButtons = { cancel: true, ok: true },
}: {
	onClose: (isok: boolean, values?: object) => void;
	children?: string | React.ReactNode;
	size?: 'sm' | 'md' | 'lg';
	backdrop?: 'static' | boolean;
	title?: string;
	text?: string;
	header?: boolean;
	buttonTitle?: { cancel?: string; ok?: string };
	buttonAlign?: 'center' | 'end' | 'start';
	align?: 'center' | 'top';
	showButtons?: { cancel?: boolean; ok?: boolean };
}) => {
	return (
		<ModalBox
			isOpen={true}
			toggle={() => onClose(false)}
			backdrop={backdrop}
			size={size}
			className={cs({ 'modal-dialog-centered': align === 'center' })}
			style={{ marginTop: `${align === 'top' ? '100px' : '0'}` }}
		>
			{header ? (
				<ModalHeader toggle={() => onClose(false)}>
					{<span className={'mx-2 fw-bold'}>{title}</span>}
				</ModalHeader>
			) : (
				<div className='mt-4'></div>
			)}
			<ModalBody className='mx-4 mt-1'>
				{text && <p>{text}</p>}
				{children && children}
			</ModalBody>
			<ModalFooter
				className='border-top-0 mb-2 gap-3'
				style={{
					justifyContent: buttonAlign,
					margin: '0 20px',
				}}
			>
				{showButtons?.cancel && (
					<Button
						color='secondary'
						onClick={() => onClose(false)}
						className='col-5'
					>
						{buttonTitle ? buttonTitle?.cancel : str.modal.cancel}
					</Button>
				)}
				{showButtons?.ok && (
					<Button
						color='primary'
						className={!showButtons?.cancel ? 'col-12' : 'col-5'}
						onClick={() => onClose(true)}
					>
						{buttonTitle ? buttonTitle?.ok : str.modal.ok}
					</Button>
				)}
			</ModalFooter>
		</ModalBox>
	);
};

export default Confirm;
