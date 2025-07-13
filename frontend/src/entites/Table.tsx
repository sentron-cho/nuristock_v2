import { styled } from '@styles/stitches.config';
import { Table as MuiTable, TableProps as MuiTableProps } from 'antd';
import Flex from './Flex';
import clsx from 'clsx';
import { AnyObject } from 'antd/es/_util/type';

export type RecordDataType = AnyObject;

interface TableProps extends MuiTableProps {
	headers: MuiTableProps['columns'];
	data?: RecordDataType[];
	rowKey?: string | ((record: RecordDataType) => string);
	loading?: boolean;
	pagination?: MuiTableProps['pagination'];
	onRowClick?: (record: RecordDataType) => void;
	emptyMessage?: string;
	fixedRowCount?: number;
}

const StyledTable = styled(Flex, {
	'&.table': {
		background: '$gray600',

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

		'.ant-table': {
			'.ant-table-body': {
				height: '100vh',

				'.ant-table-tbody': {
					tr: {
						height: '40px',
						td: {
							padding: '$4 $10',
						},
					},
				},

				'.plus': {
					color: '$plus',
				},
				'.minus': {
					color: '$minus',
				}
			},
		}
	},
});

export const Table = ({
	headers,
	data,
	rowKey = 'id',
	loading = false,
	pagination = false,
	onRowClick,
	emptyMessage = '데이터가 없습니다.',
	fixedRowCount,
	...rest
}: TableProps) => {
	return (
		<StyledTable className={clsx('table')}>
			<MuiTable
				tableLayout={'fixed'}
				columns={headers}
				dataSource={data}
				rowKey={rowKey}
				loading={loading}
				pagination={pagination}
				locale={{ emptyText: emptyMessage }}
				onRow={onRowClick ? (record) => ({ onClick: () => onRowClick(record) }) : undefined}
				scroll={{ y: fixedRowCount ? 40 * fixedRowCount : 400 }}
				{...rest}
			/>
		</StyledTable>
	);
};
