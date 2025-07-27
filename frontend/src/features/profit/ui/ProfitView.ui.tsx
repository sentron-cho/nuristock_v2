import { useEffect, useMemo } from 'react';
import { Headers } from '@features/profit/config/Profit.data';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { Table, TableRecordType } from '@entites/Table';
import { useProfitTable } from '@features/profit/hook/ProfitTable.hook';
import { getCostColorType, toCost } from '@shared/libs/utils.lib';
import { ProfitItemType, ProfitYearsItemType } from '@features/profit/api/profit.dto';
import { SubTableList } from '@features/profit/ui/SubTableList.ui';
import { FILTER_TYPE } from '../hook/ProfitTable.hook.back';
import clsx from 'clsx';
import { styled } from '@stitches/react';
import { IconRefresh } from '@entites/Icons';

const StyledView = styled(Flex, {
  '&.profit-view': {
    display: 'none',
  },

	'&.active': {
		display: 'flex',
	},
});

export const ProfitView = ({
	active = false,
	viewType,
	profitData,
	yearsData,
}: {
	active?: boolean;
	viewType?: FILTER_TYPE;
	profitData?: ProfitItemType[];
	yearsData?: ProfitYearsItemType[];
}) => {
	const {
		loading,
		formMethod,
		// summaryData,
		data,
		years,
		filteredData: list,
		total,
		// filter,
		selectedRows,
		rowClassName,
		setFilter,
		setSelectedRow,
    // clearSelectedRow,
    clear,
	} = useProfitTable(profitData, yearsData);

	const headers = useMemo(() => Headers({ filter: viewType }), [viewType]);

	useEffect(() => viewType && setFilter(viewType), [viewType]);

	const onClickTitleBar = () => {
    clear();
	};

	// const onChangeTitleBar = (value: string) => {
	// 	console.log('[onClickTitleBar]', { value });
	// };

	const onRowClick = (record: TableRecordType) => {
		setSelectedRow(record as ProfitItemType);
	};

	return (
		<StyledView className={clsx('profit-view', { active })} direction={'column'}>
			<PageTitleBar
				title={total ? `${ST.SONIC} : ${toCost(total)}` : ''}
				titleProps={{ className: getCostColorType(total) }}
				selectProps={{
					options: years,
					id: 'year',
					formMethod: formMethod,
					// defaultValue: yearsSelect?.[0]?.value,
					// onChange: onChangeTitleBar,
				}}
				buttonProps={{
          // title: ST.CLEAR,
          buttonType: 'icon',
          icon: <IconRefresh />,
          color: 'inherit',
					onClick: onClickTitleBar,
				}}
			/>

			<Flex direction={'column'} className={'table-layer'} flex={1}>
				<Table
					rowKey={'rowid'}
					headers={headers}
					data={list}
					loading={loading}
					pending={loading}
					// fixedRowCount={10}
					onRowClick={onRowClick}
					rowClassName={rowClassName}
				/>

				{selectedRows?.length && (
					<SubTableList headers={headers} selected={selectedRows} data={data} filter={viewType} />
				)}
			</Flex>
		</StyledView>
	);
};
