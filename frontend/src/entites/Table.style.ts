import { styled } from '@styles/stitches.config';
import Flex from './Flex';

export const StyledTable = styled(Flex, {
	'&.table': {
		background: '$white',
		cursor: 'default',

		'&.selection': {
			tr: {
				cursor: 'pointer',
			}
		},

		'.ant-table-thead': {
			th: {
				height: '40px',
				padding: '0 $10',
				backgroundColor: '$gray900',
				color: '$gray300',

				'&:hover': {
					backgroundColor: '$gray800',
				},
				'&:before': {
					backgroundColor: '$gray800 !important',
				},
			},

			'tr > th:first-child': {
				borderStartStartRadius: '4px !important',
			},
			'tr > th:last-child': {
				borderStartEndRadius: '4px !important',
				boxShadow: 'unset !important',
			},

			'.ant-table-column-sorter-inner > span:not(.active)': {
				color: '$gray600',
			},
		},

		'.ant-table.ant-table-empty': {
			'.ant-table-body': {
				display: 'flex',
				flexDirection: 'cloumn',
				alignItems: 'center',
				justifyContent: 'center',

				'.ant-table-placeholder > .ant-table-cell': {
					border: 'unset',
				},
			},
		},

		'.ant-table-body': {
			height: '100vh',
		},

		'.ant-table-tbody': {
			tr: {
				height: '40px',
				td: {
					padding: '$4 $10',
				},
			},

			'.ant-table-column-sort': {
				backgroundColor: '$white',
			},
		},

		'.plus': {
			color: '$plus',
		},
		'.minus': {
			color: '$minus',
		},
	},

	variants: {
		fullwidth: {
			true: {
				'.ant-table-wrapper': {
					width: '100%',
				},
			},
		},
		loading: {
			true: {
				'.ant-table-body, .ant-table-tbody': {
					visibility: 'hidden',
				},
			},
		},
	},
});