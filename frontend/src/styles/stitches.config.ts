import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, theme, createTheme, config } = createStitches({
	theme: {
		colors: {
			secondary: '#545b62',
			info: '#398bf7',
			danger: '#ef5350',
			success: '#06d79c',
			warning: '#ffb22b',
			error: '#ef5350',
			light: '#eaf2fb',
			white: '#fff',

			gray100: '#f8f9fa',
			gray200: '#f2f7f8',
			gray300: '#dee2e6',
			gray400: '#ced4da',
			gray500: '#adb5bd',
			gray600: '#99abb4',
			gray700: '#495057',
			gray800: '#343a40',
			gray900: '#1e2a35',

			box: '#f5f5f5f5',
			frame: '#f0f0f0',
			hover: '#e2f1ff',
			active: '#e2f1ff',
			alpha: '#ffffff10',
			lightwhite: '#ecf0f2',
			darkwhite: '#eaeaea',
			trans: 'transparent',
			sky: '#f1f8ff',
			primary: '#1a9be4',
			lightprimary: '#8ec3ff',
			primaryhover: '#0f55d6',
			lightyellow: '#fff5c1',
			yellow: '#fff252',
			orange: '#ff692d',
			lightorange: '#ffbe6e',
			orangehover: '#da3e00',
			red: '#ed6464',
			lightred: '#ffa8a8',
			redhover: '#9a1919',
			blue: '#0058b7',
			green: '#00c73c',
			lightgreen: '#c6ffc8',
			greenhover: '#006b20',
			black: '#000000',
			dark: '#353535',
			darkhover: '#636363',
			lightblack: '#303030',
			semiblack: '#505050',
			alphablack: '#202020a0',
			gray: '#a0a0a0',
			grayhover: '#a0a0a0',
			darkgray: '#909090',
			lightgray: '#dedede',
			alphagray: '#a0a0a090',
			disable: '#5d5d5dbd',
			up: '#D40000',
			down: '#0066CC',
			plus: '#D40000',
			minus: '#0066CC',
			select: '#f6f8fa',
			back: '#202020a0',

			bgcolor: '#f5f7fa',
		},
		fontWeights: {
			thin: '300', // 보조 설명 텍스트
			regular: '400', // 일반 본문 텍스트
			medium: '500', // 부제목 또는 강조용
			semiBold: '600', // 강조된 제목이나 라벨
			bold: '700', // 메인 제목 또는 숫자 강조
		},
		space: {
			1: '1px',
			2: '2px',
			4: '4px',
			8: '8px',
			10: '10px',
			12: '12px',
			16: '16px',
			20: '20px',
			24: '24px',
			28: '28px',
			32: '32px',
			40: '40px',
			64: '64px',
		},
		fonts: {
			body: 'system-ui, sans-serif',
		},
		fontSizes: {
			xxs: '10px',
			xs: '12px',
			sm: '14px',
			md: '16px',
			lg: '20px',
			xl: '24px',
			xxl: '32px',
		},
		radii: {
			sm: '4px',
			md: '8px',
			lg: '12px',
		},
		sizes: {
			formSmall: '24px',
			formMedium: '32px',
			formLarge: '40px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1440px',
			pageWidth: '$xl',
		},
		lineHeights: {
			formSmall: '24px',
			formMedium: '32px',
			formLarge: '40px',
		},
	},
	media: {
		sm: '(max-width: 640px)',
		md: '(max-width: 768px)',
		lg: '(max-width: 1024px)',
		xl: '(max-width: 1440px)',
	},
	utils: {
		// margin x 축 (mx)
		mx: (value: string | number) => ({
			marginLeft: value,
			marginRight: value,
		}),
		// padding y 축 (py)
		py: (value: string | number) => ({
			paddingTop: value,
			paddingBottom: value,
		}),
		// shorthand bg
		bg: (value: string) => ({
			backgroundColor: value,
		}),
	},
});
