import { styled } from '@stitches/react';
import { Property } from 'node_modules/@stitches/react/types/css';
import { MouseEventHandler, SyntheticEvent } from 'react';

const StyledComponent = styled('span', {
	'&.thumb': {
		background: 'white',
		width: '100%',
		height: '100%',
		// display: 'inline-block',
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		alignItems: 'center',
		justifyContent: 'center',

		img: {
			width: '100%',
			height: '100%',
		},

		'.place-holder': {
			color: '$primary',
			padding: '10px',
			textAlign: 'center',
			wordBreak: 'keep-all',
			lineHeight: '28px',
			opacity: '0.8',

			'&.primary': {
				color: '$primary',
			},

			'&.danger': {
				color: '$danger',
			},

			'&.secondary': {
				color: '$secondary',
			},
		},
	},

	variants: {
		hover: {
			true: {
				cursor: 'pointer',
			},
		},
		border: {
			true: {
				border: '1px solid $border',
			},
		},
		radius: {
			true: {
				borderRadius: '4px',
			},
		},
		size: {
			auto: {
				'&.thumb': {
					width: 'auto',
					height: 'auto',
				},
			},
			sm: {
				'&.thumb': {
					width: '80px',
					height: '60px',
				},
			},
			md: {
				'&.thumb': {
					width: '140px',
					height: '100px',
				},
			},
			lg: {
				'&.thumb': {
					width: '180px',
					height: '120px',
				},
			},
			xl: {
				'&.thumb': {
					width: '240px',
					height: '160px',
				},
			},
			full: {
				'&.thumb': {
					width: '100%',
					height: '100%',
				},
			},
		},
	},
});

const Thumbnail = ({
	size = 'full',
	src = '',
	alt = '',
	border = true,
	radius = true,
	objectFit = 'contain',
	onClick,
	className = '',
	placeholder = '',
	placeholderColor = 'danger',
}: {
	size?: 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
	src?: string;
	alt?: string;
	border?: boolean;
	radius?: boolean;
	objectFit?: Property.ObjectFit;
	onClick?: (e: SyntheticEvent) => void;
	className?: string;
	placeholder?: string;
	placeholderColor?: 'secondary' | 'primary' | 'danger';
}) => {
	return (
		<StyledComponent
			className={`thumb ${className || ''}`}
			size={size}
			border={border}
			radius={radius}
			onClick={onClick}
			hover={!!onClick}
		>
			{src && <img src={src} alt={alt} style={{ objectFit: objectFit }} />}
			{!src && placeholder && (
				<span className={`place-holder ${placeholderColor || ''}`}>
					{placeholder}
				</span>
			)}
		</StyledComponent>
	);
};

export default Thumbnail;
