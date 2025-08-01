import clsx from 'clsx';
import { ProfitItemType as DataType } from '../api/profit.dto';
import { StyledCard } from '../style/ProfitCardPerCode.style';
import { SubTitle } from '@entites/Title';
import Flex from '@entites/Flex';
import { ST } from '@shared/config/kor.lang';

export const ProfitCardPerCode = ({
	data,
}: {
	data?: DataType[]; // 년도별 데이터
}) => {
	console.log({ data });

	return (
		<StyledCard className={clsx('card')}>
			<Flex className={clsx('box')} direction='column' gap={10}>
				{/* 월별 */}
				<Flex className='years' direction={'column'} gap={10}>
					<Flex className='head' justify={'between'}>
						<SubTitle title={ST.PER_MONTHS} width={'100%'} textAlign={'center'} />
					</Flex>

					<Flex direction={'column'} className='body' gap={8}>
						{/* {yearList?.map((title) => {
                const item = yearData?.[title];
                const type = valueOfPlusMinus(item?.sonic, 0);
                return (
                  <Flex className={clsx(type)} direction={'row'} justify={'between'}>
                    <Text text={title} />
                    <Text text={toCost(item?.sonic)} />
                  </Flex>
                );
              })} */}
					</Flex>
				</Flex>
			</Flex>
		</StyledCard>
	);
};
