import { Button } from '@entites/Button';
import { PageContainer } from '../../features/common/ui/PageContainer.ui';
import { useState } from 'react';
import { ErrorType } from 'src/layouts/ui/ErrorBoundary';

const StockPage = () => {
    const [triggerError, setTriggerError] = useState(false);

  if (triggerError) {
    const error = new Error('인증 오류입니다');
    error.name = ErrorType.Unknown;
    throw error;
  }

  return <PageContainer>
    <Button title={'인증 에러 발생'} onClick={() => setTriggerError(true)} />
  </PageContainer>;
};

StockPage.displayName = 'StockPage';
export default StockPage;
