import { Table, TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface CommonTableProps<T> extends TableProps<T> {
	headers: ColumnsType<T>;
	data: T[];
	rowKey?: string | ((record: T) => string);
	loading?: boolean;
	pagination?: TableProps['pagination'];
	onRowClick?: (record: T) => void;
	emptyMessage?: string;
}

export const TableWrapper = <T extends object>({
	headers,
	data,
	rowKey = 'id',
	loading = false,
	pagination = false,
	onRowClick,
	emptyMessage = '데이터가 없습니다.',
	...rest
}: CommonTableProps<T>) => {
	return (
		<Table<T>
			columns={headers}
			dataSource={data}
			rowKey={rowKey}
			loading={loading}
			pagination={pagination}
			locale={{ emptyText: emptyMessage }}
			onRow={onRowClick ? (record) => ({ onClick: () => onRowClick(record) }) : undefined}
			{...rest}
		/>
	);
};

