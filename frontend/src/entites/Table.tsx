import { styled } from '@styles/stitches.config';
import { Table as MuiTable, TableProps as MuiTableProps } from 'antd';
import Flex from './Flex';
import clsx from 'clsx';
import { AnyObject } from 'antd/es/_util/type';
import { useEffect, useMemo, useRef, useState } from 'react';

export type TableRecordType = AnyObject;

const StyledTable = styled(Flex, {
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

interface TableProps extends MuiTableProps {
	headers: MuiTableProps['columns'];
	data?: TableRecordType[];
	rowKey?: string | ((record: TableRecordType) => string);
	loading?: boolean;
	pending?: boolean;
	pagination?: MuiTableProps['pagination'];
	onRowClick?: (record: TableRecordType) => void;
	emptyMessage?: string;
	fixedRowCount?: number;
	fullwidth?: boolean;
	className?: string;
}

export const Table = ({
	headers,
	data,
	rowKey = 'id',
	loading = false,
	pending = false,
	pagination = false,
	onRowClick,
	emptyMessage = '데이터가 없습니다.',
	fixedRowCount,
	fullwidth = true,
	className,
	...rest
}: TableProps) => {
	const ref = useRef(null);
	const [tableWidth, setTableWidth] = useState<number>();

	const parsedHeader = useMemo(() => {
		return headers?.map((item) => {
			// if (!item?.minWidth) {
			// 	item['minWidth'] = 120;
			// }

			!item?.width && (item['width'] = 120);
			return item;
		});
	}, [headers]);

	// const isDesktop = useMediaQuery('(max-width:1440px)')

	useEffect(() => {
		const handleResize = () => {
			if (!ref.current) return;

			const { scrollWidth } = ref.current as HTMLElement;
			setTableWidth(scrollWidth);
			const width = window.innerWidth;
			console.log({ width, table: scrollWidth });
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (!ref?.current) return;

		const { scrollWidth } = ref.current as HTMLElement;
		setTableWidth(scrollWidth);
	}, [ref]);

	return (
		<StyledTable
			fullwidth={fullwidth}
			loading={loading}
			ref={ref}
			className={clsx('table', { className, selection: !!onRowClick })}>
			<MuiTable
				// tableLayout={'fixed'}
				columns={parsedHeader}
				dataSource={data}
				rowKey={rowKey}
				loading={loading}
				pagination={pagination}
				locale={{ emptyText: emptyMessage }}
				onRow={onRowClick ? (record) => ({ onClick: () => onRowClick(record) }) : undefined}
				scroll={{
					y: fixedRowCount ? 40 * fixedRowCount : undefined,
					x: fullwidth ? (fixedRowCount ? (tableWidth || 0) - 20 : tableWidth) : undefined,
				}}
				{...rest}
			/>
		</StyledTable>
	);
};
