import { styled } from '@stitches/react';

export const StyledEditor = styled('div', {
	'&.app-editor': {
		height: 'calc(100vh)',
		width: '100vw', //'calc(100vw - 340px)',
		zIndex: 999,
		position: 'absolute',
		top: 0,
		background: 'white',

		'.header': {
			width: '100%',
			position: 'fixed',
			top: '0',
			height: '0',
			zIndex: 10,

			'.logo': {
				position: 'absolute',
				top: '3px',
				left: '25px',
			},

			'.title-bar': {
				position: 'absolute',
				top: '16px',
				left: '50%',
				width: '400px',
				transform: 'translateX(-50%)',
			},

			'.side-menus': {
				position: 'absolute',
				right: '20px',
				top: '14px',
				width: '300px',
				display: 'flex',
				flexDirection: 'row',
				flexWrap: 'nowrap',
				alignContent: 'center',
				alignItems: 'center',
				justifyContent: 'flex-end',

				'.btn-library': {},
			},
		},

		'.frame': {
			width: '100%',
			height: '100vh',
			position: 'fixed',
			zIndex: 1,

			'.excalidraw': {
				overflow: 'visible',
			},

			'.dropdown-menu': {
				display: 'block',
				boxShadow: 'unset',
				padding: '0',
				background: 'unset',
			},

			'.layer-ui__wrapper__top-right': {
				'& > label': {
					display: 'none',
				},
			},

			'.App-menu': {
				zIndex: 11,
				'& > div.App-menu_top__left': {
					position: 'absolute',
					left: '200px',
					top: '-4px',

					'& > .selected-shape-actions': {
						position: 'absolute',
						top: '50px',
						left: '-140px',
					},
				},

				'.shapes-section': {
					width: '40px',
					position: 'absolute',
					left: '0',
					top: '60px',
					zIndex: '10',
				},

				'.App-toolbar': {
					'& > .Stack': {
						display: 'flex',
						flexDirection: 'column',
						flexWrap: 'nowrap',

						'.App-toolbar__extra-tools-dropdown': {
							top: 'unset',
							left: '50px',
							bottom: '0',
						},

						'.App-toolbar__divider': {
							width: '100%',
							height: '1px',
						},
					},

					'& > .HintViewer': {
						position: 'fixed',
						top: '50px',
					},
				},
			},
		},
	},
});
