import { styled } from '@stitches/react';
import cs from 'classnames';

const StyledTitle = styled('div', {
	'&.title-bar': {
		margin: '0px',
		padding: '10px 0px',
		height: '60px',
		display: 'flex',
		userSelect: 'none',
		flexDirection: 'row',
		alignItems: 'center',

		'.tb-tit, .tb-sub': {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
		},

		'.tb-tit': {
			paddingTop: '4px',
			paddingRight: '20px',
		},

		'.tb-sub': {
			flexGrow: 1,
		},
	},
});

const TitleBar = ({
	title,
	children,
	className,
}: {
	title?: string;
	children?: React.ReactNode;
	className?: string;
}) => {
	return (
		<StyledTitle className={`title-bar ${className || ''}`}>
			<div className='tb-tit'>
				{title && <h1 className='fw-bold fs-4 mb-0'>{title}</h1>}
			</div>
			{children && <div className={cs('tb-sub')}>{children}</div>}
		</StyledTitle>
	);
};

const StyledSubTitle = styled('div', {
	'&.subtitle-bar': {
		margin: '0px',
		padding: '10px 0px',
		height: '60px',
		display: 'flex',
		userSelect: 'none',
		flexDirection: 'row',
		alignItems: 'center',

		'.tb-tit, .tb-sub': {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
		},

		'.tb-tit': {
			marginTop: '-6px',
			paddingRight: '20px',
		},

		'.tb-sub': {
			flexGrow: 1,
		},
	},

	h1: {
		paddingTop: '4px',
	},
});

export const SubTitle = ({
	title,
	bold = false,
	children,
	className,
}: {
	title?: string;
	bold?: boolean;
	children?: React.ReactNode;
	className?: string;
}) => {
	return (
		<StyledSubTitle className={`subtitle-bar ${className || ''}`}>
			<div className='tb-tit'>
				{title && <h1 className={`${bold && 'fw-bold'} fs-5 mb-0`}>{title}</h1>}
			</div>
			{children && <div className={cs('tb-sub')}>{children}</div>}
		</StyledSubTitle>
	);
};

export default TitleBar;
