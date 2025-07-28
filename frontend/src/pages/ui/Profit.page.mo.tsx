import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { styled } from '@styles/stitches.config';
import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import { useProfitTable } from '@features/profit/hook/ProfitTable.hook';

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

    '.contents-wrap > div:last-child > div': {
      marginBottom: '$20',
    },
  },
});

export const ProfitPageMo = () => {

  const { data: yearsData } = useSelectProfitYears();
  const { data: profitData } = useSelectProfit();

  const { summaryData } = useProfitTable(profitData?.value, yearsData?.value);

  const onClickSummary = (item?: SummaryDataType) => {
    console.log(item);
  };

  return (
    <StyledPage className='profit' summaryData={summaryData} onClickSummary={onClickSummary}>
      Mobile Page
    </StyledPage>
  );
};