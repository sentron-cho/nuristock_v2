import { ColumnsType } from 'antd/es/table';
import { ProfitItemType } from '../api/profit.dto';
import Flex from '@entites/Flex';
import { Table } from '@entites/Table';
import { styled } from '@stitches/react';
import clsx from 'clsx';
import { Text } from '@entites/Text';

const StyledTable = styled(Flex, {
	marginTop: '20px',

	'.ant-table-header, .ant-table-thead': {
		display: 'none',
	},
});

interface SubTableListProps {
	headers?: ColumnsType;
	selected?: string[];
	loading?: boolean;
	data?: ProfitItemType[];
	filter?: string;
}

export const SubTableList: React.FC<SubTableListProps> = ({ headers, selected, loading, data, filter }) => {
  console.log({ filter, data });

  // const [dataList, setDataList] = useState<ProfitItemType[]>();
  
  // const filterKey = useMemo(() => {
  //   if (filter === 'codes') return 'name';
  //   else if (filter === 'months') return 'sdate';
  //   else return 'sdate';
  // }, [filter]);

	if (!selected || !headers || filter === 'all') return null;

	return (
		<StyledTable className={clsx('sub-table-list')} direction={'column'} gap={20}>
      {selected?.map((name) => {
        // const item = data?.find(a => a?.name === name);
        // const filterCode = item?.name;
        const parsedName = filter === 'codes' ? name : name?.replace(/-/g, '');
        const subItems = data?.filter(a => {
          return filter === 'codes' ? a?.name === parsedName : a?.edate?.includes(parsedName);
        });

        console.log({parsedName, subItems});

				return (
          <Flex direction={'column'} gap={4}>
            <Text text={name} />
						<Table
							rowKey={'rowid'}
							headers={headers}
							data={subItems}
							loading={loading}
							pending={loading}
						/>
					</Flex>
				);
			})}
		</StyledTable>
	);
};
