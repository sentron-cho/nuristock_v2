import { Table as MuiTable, TableProps as MuiTableProps } from 'antd';
import clsx from 'clsx';
import { AnyObject } from 'antd/es/_util/type';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyledTable } from './Table.style';

export type TableRecordType = AnyObject;

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
	width?: number | string;
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
	width,
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
			// const width = window.innerWidth;
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
			className={clsx('table', { className, selection: !!onRowClick })}
		>
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
					x: width || (fullwidth ? (fixedRowCount ? (tableWidth || 0) - 20 : tableWidth) : undefined),
				}}
				// style={{ width: '100%' }}
				{...rest}
			/>
		</StyledTable>
	);
};
