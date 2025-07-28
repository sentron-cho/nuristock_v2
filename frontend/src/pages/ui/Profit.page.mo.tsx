import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { styled } from '@styles/stitches.config';
import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { ProfitCard } from '@features/profit/ui/ProfitCard.ui';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import { SummaryData } from '@features/profit/config/Profit.data';

const StyledPage = styled(PageContainer, {
  '&.profit': {
    box: {
      paddingBottom: '40px',
    },

    '.table-layer': {
      marginTop: '$10',
    },

    '.card-list': {
      flexWrap: 'wrap',
      gap: '$0',
    },
  },
});

export const ProfitPageMo = () => {

  const { data: yearsData } = useSelectProfitYears();
  const { data: profitData } = useSelectProfit();

  const { summary, years, data } = useProfitData(profitData?.value, yearsData?.value);

  const onClickSummary = (item?: SummaryDataType) => {
    console.log(item);
  };

  return (
    <StyledPage className='profit' summaryData={SummaryData(summary)} onClickSummary={onClickSummary}>
      <Flex className='card-list'>
        {years?.map((item) => {
          return <ProfitCard item={item} data={data} />
        })}
      </Flex>
    </StyledPage>
  );
};