import { Button } from '@entites/Button';
import { PageContainer } from '../../features/common/ui/PageContainer.ui';
import { ErrorType } from 'src/layouts/ui/ErrorBoundary';
import { useErrorBoundary } from 'react-error-boundary';

const MarketPage = () => {
	const { showBoundary } = useErrorBoundary();

	const throwCustomError = () => {
		const error = new Error('인증 오류입니다');
		error.name = ErrorType.Unknown;
		showBoundary(error);
	};

	return (
		<PageContainer>
			<Button title={'인증 에러 발생'} onClick={throwCustomError} />
		</PageContainer>
	);
};

MarketPage.displayName = 'MarketPage';
export default MarketPage;
