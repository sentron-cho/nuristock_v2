import { Table } from 'reactstrap';
import { styled } from '@stitches/react';
import NoData from './NoData';
import { str } from '@/langs/common.langs';
import cs from 'classnames';
import { Property } from 'node_modules/@stitches/react/types/css';
import LinkButton from './LinkText';

const StyledTable = styled('div', {
	'&': {
		height: 'auto',
		// maxHeight: '100vh',
		overflow: 'hidden',
		overflowY: 'auto',
		minHeight: '200px',
	},

	'.table': {
		margin: 0,
	},

	'.t-head': {
		height: '40px',

		'& > tr, & > tr > th': {
			margin: '0',
			padding: '0',
			height: '40px',

			div: {
				height: '40px',
				lineHeight: '40px',
				borderTop: 'solid 1px $info',
				borderBottom: 'solid 1px $info',
			},
		},

		'&.sticky': {
			position: 'sticky',
			top: '0',
			zIndex: '10',
		},
	},

	'&.selection .t-body': {
		cursor: 'pointer',
	},

	'.t-body': {
		'& > tr > td': {
			border: 'unset',
			verticalAlign: 'middle',
			padding: '6px 10px',
			lineHeight: '28px',
		},
		'& > tr > td:not(:last-child)': {
			borderRight: 'solid 1px $light',
		},
		'tr:nth-of-type(odd) > *': {
			background: '#d8f0ff',
		},
	},

	'& > .no-item': {
		minHeight: '100px',
		height: 'calc(100% - 60px)',
	},
});

export interface ITableHeader {
	key: string;
	label: string;
	width?: string;
	align?: 'center' | 'left' | 'right';
	formatter?: (value: string, item: Object) => string | React.ReactElement;
}

const TableBox = ({
	header,
	items,
	showHeader = true,
	type,
	hover,
	no,
	className,
	sticky = true,
	onSelect,
	onClickEdit,
	showShareButton = false,
}: {
	header: Array<ITableHeader>;
	items?: Array<any> | null;
	showHeader?: boolean;
	type?: '' | 'strip'; // | 'dark';
	hover?: boolean;
	no?: 'asc' | 'desc' | '';
	className?: string;
	sticky?: boolean;
	onSelect?: (item: object) => void;
	onClickEdit?: (item: object, type: string) => void;
	showShareButton?: boolean;
}) => {
	const isNodata = !(items && items.length > 0);
	// const headitems = header && Object.keys(header).map(key => {
	//   return key
	// })
	const isEdit = !!onClickEdit;

	return (
		<StyledTable
			className={cs(`table-box ${className || ''}`, {
				selection: onSelect ? true : false,
			})}
		>
			<Table hover={hover} striped={type === 'strip'} className='table-layer'>
				{/* 테이블 헤드 */}
				{showHeader && (
					<thead className={cs('t-head', { sticky: sticky })}>
						<tr>
							{no && (
								<th
									className='th-no fw-bold text-center'
									style={{ width: '60px' }}
								>
									<div>{str.label.no}</div>
								</th>
							)}

							{header.map((head) => {
								return (
									<th
										className='th fw-bold text-center'
										key={head.key}
										style={{ width: head.width || '' }}
									>
										<div>{head.label}</div>
									</th>
								);
							})}

							{isEdit && (
								<th
									className='th-no fw-bold text-center'
									style={{ width: showShareButton ? '160px' : '120px' }}
								>
									<div>{str.label.management}</div>
								</th>
							)}
						</tr>
					</thead>
				)}

				{/* <th scope='row'>1</th> */}
				{/* 테이블 바디 */}
				{!isNodata && (
					<tbody className='t-body'>
						{items.map((row, idx) => {
							// items = [{id: '1', name:: '홍길동1'}, {id: '1', name:: '홍길동2'}]
							// row = {id: '1', name:: '홍길동1'}
							// console.log('[collist]', header);
							return (
								<tr key={`tr-${idx}`}>
									{no && (
										<td className='th-no' style={{ textAlign: 'center' }}>
											{no === 'asc' ? idx + 1 : items.length - idx}
										</td>
									)}

									{header.map((head) => {
										// console.log('[colkey]', head);
										// console.log('[row[idx]]', row[head.key]);
										const { align = 'left', key } = head;
										const item = row[key] || '';
										return (
											<td
												className='td'
												key={`td-${idx}-${head.key}`}
												style={{ textAlign: align as Property.TextAlign }}
												onClick={() => onSelect?.(row)}
											>
												{head.formatter
													? head.formatter(row[head.key], row)
													: item}
											</td>
										);
									})}

									{isEdit && (
										<td className='th-no' style={{ textAlign: 'center' }}>
											<LinkButton
												label={str.button.edit}
												onClick={() => onClickEdit(row, 'edit')}
											/>
											<span>|</span>
											<LinkButton
												label={str.button.remove}
												onClick={() => onClickEdit(row, 'remove')}
											/>
											{showShareButton && (
												<>
													<span>|</span>
													<LinkButton
														label={str.button.share}
														onClick={() => onClickEdit(row, 'share')}
													/>
												</>
											)}
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
				)}
			</Table>
			{isNodata && <NoData title={str.nodata} />}
		</StyledTable>
	);
};

export default TableBox;
