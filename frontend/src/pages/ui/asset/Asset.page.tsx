import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { AssetPageMo } from './Asset.page.mo';
import { useSelectAsset } from '@features/asset/api/asset.api';

const BucketlistPage = ({ viewType = 'asset' }: { viewType?: 'asset' | 'evaluation' }) => {
	const { isMobile } = useCommonHook();

	const { data } = useSelectAsset();

	return (
		<>
			{isMobile && <AssetPageMo data={data} viewType={viewType} />}
			{!isMobile && <AssetPageMo data={data} viewType={viewType} />}
		</>
	);
};

BucketlistPage.displayName = 'BucketlistPage';
export default BucketlistPage;
